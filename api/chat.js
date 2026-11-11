// Server-side proxy for OpenRouter.
//
// The browser never sees the API key: every AI request goes to this function,
// which adds the Authorization header from the server environment and forwards
// the response (including SSE streams) back to the client.
//
// Deployed as a Vercel Node function. In local development the matching proxy
// in vite.config.js serves the same /api/chat endpoint.

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const sendJson = (res, status, payload) => {
  res.status(status).json(payload);
};

export default async function handler(req, res) {
  // Lets the client tell a real proxy response from a static host's HTML shell.
  res.setHeader('x-ai-proxy', 'studymapper');

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    res.setHeader('x-ai-proxy-error', 'no-key');
    sendJson(res, 503, { error: 'AI is not configured on this deployment.' });
    return;
  }

  let payload = req.body;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      sendJson(res, 400, { error: 'Invalid JSON body' });
      return;
    }
  }

  const { model, messages, stream = false } = payload || {};
  if (!model || !Array.isArray(messages) || messages.length === 0) {
    sendJson(res, 400, { error: 'model and messages are required' });
    return;
  }

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.origin || 'https://study-mapper.vercel.app',
        'X-Title': 'StudyMapper',
      },
      body: JSON.stringify({ model, messages, ...(stream ? { stream: true } : {}) }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      sendJson(res, upstream.status, { error: text || `Upstream error (${upstream.status})` });
      return;
    }

    if (!stream) {
      sendJson(res, 200, await upstream.json());
      return;
    }

    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    if (typeof res.flushHeaders === 'function') res.flushHeaders();

    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (error) {
    console.error('AI proxy error:', error);
    if (res.headersSent || res.writableEnded) {
      res.end();
      return;
    }
    sendJson(res, 502, { error: 'The AI service could not be reached.' });
  }
}
