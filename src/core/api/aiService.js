// OpenRouter AI Service — with Streaming support
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// Free models — ordered to prioritize models that can generate VERY long JSON without truncating
const FREE_MODELS = [
  "google/gemma-4-31b-it:free",               // 31B — large context, very reliable for long JSON
  "nvidia/nemotron-3-ultra-550b-a55b:free",   // 550B — capable of long generation
  "nvidia/nemotron-3-super-120b-a12b:free",   // 120B — capable of long generation
  "poolside/laguna-s-2.1:free",
  "openrouter/free"
];

// Vision-capable models
const VISION_MODELS = [
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "dots-studio/dots-3-note-preview:free",
];

// Non-streaming call (used for syllabus extraction and JSON responses)
export const callOpenRouter = async (messages) => {
  let lastError = null;

  for (const model of FREE_MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout — big models take time to start

    try {
      const response = await fetch(OPENROUTER_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "StudyMapper",
        },
        body: JSON.stringify({
          model,
          messages,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`API error (${response.status}): ${err}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn(`Model ${model} failed, trying next...`, error);
      lastError = error;
      // continue to the next model in the array
    }
  }

  throw new Error(`All AI models failed. Last error: ${lastError?.message || 'Unknown error'}`);
};

export const callOpenRouterVision = async (base64Image, prompt) => {
  let lastError = null;

  for (const model of VISION_MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s for vision

    try {
      const messages = [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: base64Image } }
          ]
        }
      ];

      const response = await fetch(OPENROUTER_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "StudyMapper",
        },
        body: JSON.stringify({ model, messages }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`API error (${response.status}): ${err}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn(`Vision model ${model} failed, trying next...`, error);
      lastError = error;
    }
  }

  throw new Error(`All vision models failed. Last error: ${lastError?.message || 'Unknown error'}`);
};

// Streaming call — calls onChunk(textSoFar) as each token arrives
export const callOpenRouterStream = async (messages, onChunk) => {
  let lastError = null;

  for (const model of FREE_MODELS) {
    try {
      const response = await fetch(OPENROUTER_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "StudyMapper",
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`API error (${response.status}): ${err}`);
      }

      // If we reach here, connection is successful!
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process SSE lines
        const lines = buffer.split("\n");
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;

          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              onChunk(fullText);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      return fullText; // Success! Break out of the loop by returning
    } catch (error) {
      console.warn(`Streaming Model ${model} failed, trying next...`, error);
      lastError = error;
      // continue to the next model
    }
  }

  throw new Error(`All AI models failed to stream. Last error: ${lastError?.message || 'Unknown error'}`);
};

const extractJson = (text) => {
  if (!text) return null;
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(text.substring(start, end + 1));
    }
  } catch {}
  try {
    const arrStart = text.indexOf('[');
    const arrEnd = text.lastIndexOf(']');
    if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
      return JSON.parse(text.substring(arrStart, arrEnd + 1));
    }
  } catch {}
  return null;
};

export const extractSyllabusFromText = async (ocrText, onChunk) => {
  const messages = [
    {
      role: "system",
      content: "You are an expert educational AI. You extract syllabus structures from text and return ONLY valid JSON, no markdown, no explanation."
    },
    {
      role: "user",
      content: `Extract the syllabus structure from the following text.
Identify the Subject Name (if available), Units, Modules, Chapters, and Topics/Subtopics.
Handle Roman numerals (I, II, III), Arabic numerals (1, 2, 3), bullets, and nested topics.
Recognize patterns like "UNIT I", "Unit 1", "Module 1", "Chapter 1".
Ignore page numbers and unnecessary symbols.

IMPORTANT RULES FOR TOPICS:
1. You MUST separate distinct topics into individual strings.
2. Syllabus topics are often separated by hyphens (-), en-dashes (–), commas (,), or semicolons (;). You MUST split them aggressively. 
   Example: "Topic A - Topic B – Topic C" becomes ["Topic A", "Topic B", "Topic C"].
3. NEVER combine multiple distinct concepts into a single long string.

Return ONLY a valid JSON object matching this schema exactly:
{
  "subject": "Name of Subject",
  "units": [
    {
      "title": "Unit Title",
      "topics": ["Topic 1", "Topic 2"]
    }
  ]
}

Text:
${ocrText}`
    }
  ];

  if (onChunk) {
    const parsePartialSyllabus = (text) => {
      const subjectMatch = text.match(/"subject":\s*"([^"]+)"/);
      const subject = subjectMatch ? subjectMatch[1] : 'Parsing Subject...';
      
      const units = [];
      const unitMatches = [...text.matchAll(/\{\s*"title":\s*"([^"]+)",\s*"topics":\s*\[(.*?)\]?/gs)];
      
      for (const m of unitMatches) {
        const title = m[1];
        const topicsRaw = m[2];
        const topicMatches = [...topicsRaw.matchAll(/"([^"]+)"/g)];
        const topics = topicMatches.map(tm => tm[1]);
        units.push({ title, topics });
      }
      
      const lastUnitTitleMatch = [...text.matchAll(/\{\s*"title":\s*"([^"]+)"(?:\s*,\s*"topics":\s*\[)?/gs)].pop();
      if (lastUnitTitleMatch) {
         const title = lastUnitTitleMatch[1];
         if (!units.find(u => u.title === title)) {
            const afterMatch = text.substring(lastUnitTitleMatch.index + lastUnitTitleMatch[0].length);
            const topicMatches = [...afterMatch.matchAll(/"([^"]+)"/g)];
            units.push({ title, topics: topicMatches.map(tm => tm[1]) });
         }
      }
      return { subject, units };
    };

    const finalResponse = await callOpenRouterStream(messages, (chunkText) => {
      onChunk(parsePartialSyllabus(chunkText));
    });
    return extractJson(finalResponse) || parsePartialSyllabus(finalResponse);
  }

  const responseText = await callOpenRouter(messages);
  return extractJson(responseText);
};

export const extractSyllabusFromImage = async (base64Image) => {
  const prompt = `Extract the syllabus structure from this image.
Identify the Subject Name (if available), Units, Modules, Chapters, and Topics/Subtopics.
Handle Roman numerals (I, II, III), Arabic numerals (1, 2, 3), bullets, and nested topics.
Recognize patterns like "UNIT I", "Unit 1", "Module 1", "Chapter 1".
Ignore page numbers and unnecessary symbols.

IMPORTANT RULES FOR TOPICS:
1. You MUST separate distinct topics into individual strings.
2. Syllabus topics are often separated by hyphens (-), en-dashes (–), commas (,), or semicolons (;). You MUST split them aggressively. 
   Example: "Topic A - Topic B – Topic C" becomes ["Topic A", "Topic B", "Topic C"].
3. NEVER combine multiple distinct concepts into a single long string.

Return ONLY a valid JSON object matching this schema exactly:
{
  "subject": "Name of Subject",
  "units": [
    {
      "title": "Unit Title",
      "topics": ["Topic 1", "Topic 2"]
    }
  ]
}`;
  const responseText = await callOpenRouterVision(base64Image, prompt);
  return extractJson(responseText);
};

export const getTopicNotesPrompt = (topicTitle, subjectTitle) => [
  {
    role: "system",
    content: "You are an expert engineering professor. Generate a structured, engaging, and beginner-friendly explanation for every syllabus topic. You return ONLY valid JSON, no markdown fences outside the JSON values."
  },
  {
    role: "user",
    content: `Generate comprehensive educational notes for the topic "${topicTitle}" in the context of the subject "${subjectTitle}".
The explanation should feel like a teacher explaining the topic in class, gradually building from basic concepts to advanced understanding.

# AI Generation Rules
* Explain concepts from beginner to advanced.
* Use simple, natural English.
* Avoid unnecessary jargon and explain technical terms.
* Keep paragraphs short and readable.
* Use markdown formatting (headings, bullet points, and tables) inside the JSON string values where appropriate.
* Highlight important keywords using markdown **bold**.
* Ensure all information is technically accurate and suitable for engineering students.
* Adapt explanations automatically based on the subject (AI, DBMS, Operating Systems, Computer Networks, Data Structures, Software Engineering, etc.).

Return ONLY a valid JSON object matching this schema exactly. For any missing/inapplicable section, provide an empty string or empty array.
{
  "topic_header": {
    "topic_name": "${topicTitle}",
    "subject": "${subjectTitle}",
    "estimated_reading_time": "e.g., 5 mins",
    "difficulty": "Easy / Medium / Hard"
  },
  "learning_objectives": ["Understand the concept...", "Explain how it works..."],
  "prerequisites": "Mention concepts to know beforehand. If none, write: '> No prior knowledge required.'",
  "introduction": "Simple explanation: What it is, why it is important, where it is used.",
  "core_concepts": "Markdown string: Break into logical sections with headings. Explain technical terms when they first appear.",
  "how_it_works": "Markdown string: Step-by-step process using numbered points. Skip if not applicable.",
  "diagram": "Markdown string: ONLY IF HELPFUL, generate a Mermaid diagram (inside a markdown code block with 'mermaid' language). CRITICAL: Quote node labels containing special characters or spaces (e.g., id[\"Label (Extra Info)\"]). Skip if it doesn't add value.",
  "real_life_analogy": "One simple everyday analogy.",
  "real_world_example": "One practical example in real life, industry, or technology.",
  "applications": ["Application 1: one-line explanation", "Application 2: one-line explanation"],
  "advantages": ["Advantage 1: brief explanation", "Advantage 2: brief explanation"],
  "disadvantages": ["Disadvantage 1: brief explanation", "Disadvantage 2: brief explanation"],
  "comparison": "Markdown string: A comparison table (e.g., AI vs Machine Learning). Skip if not relevant.",
  "key_terms": [
    {
      "term": "Term",
      "definition": "One-line definition"
    }
  ],
  "key_points": ["Important definition", "Keyword", "Exam-focused point"],
  "summary": ["Bullet point 1", "Bullet point 2"]
}`
  }
];

export const extractQuestionsFromText = async (text, onChunk) => {
  const messages = [
    {
      role: "system",
      content: "You are an expert educational AI. Extract all questions and their allocated marks from the given exam paper or question bank text. Return ONLY a valid JSON array, no markdown."
    },
    {
      role: "user",
      content: `Extract all questions from the text below. Identify the exact question text and the allocated marks (e.g., "10M", "2M", "5 Marks").
If the marks are not explicitly stated next to the question, look for section headers (e.g., "Part A - 2 Marks each") and infer them. If totally unknown, use "Unknown".

Return ONLY a valid JSON array of objects matching this schema exactly:
[
  {
    "text": "What is virtual memory and how does it work?",
    "marks": "2M"
  },
  {
    "text": "Discuss the key operating system operations involved in program execution",
    "marks": "10M"
  }
]

Text:
${text}`
    }
  ];

  if (onChunk) {
    const parsePartialQuestions = (chunk) => {
      const matches = [...chunk.matchAll(/\{[^{}]+\}/g)];
      const qs = matches.map(m => {
        try { return JSON.parse(m[0]); } catch { return null; }
      }).filter(Boolean);
      
      const lastIndex = matches.length > 0 ? matches[matches.length - 1].index + matches[matches.length - 1][0].length : 0;
      const remainder = chunk.substring(lastIndex);
      
      const incompleteTextMatch = remainder.match(/"text":\s*"([^"\\]*(?:\\.[^"\\]*)*)/);
      if (incompleteTextMatch) {
          qs.push({ text: incompleteTextMatch[1].replace(/\\"/g, '"') + '...', marks: '...' });
      }
      return qs;
    };

    const finalResponse = await callOpenRouterStream(messages, (chunkText) => {
      const partial = parsePartialQuestions(chunkText);
      if (partial.length > 0) onChunk(partial);
    });
    return extractJson(finalResponse) || parsePartialQuestions(finalResponse);
  }

  const responseText = await callOpenRouter(messages);
  return extractJson(responseText);
};

export const getQuestionAnswerPrompt = (questionText, marks, subjectTitle, detailLevel = 'simple') => [
  {
    role: "system",
    content: "You are an expert engineering professor teaching BTech/undergraduate students. Your primary goal is to make complex engineering and technical concepts incredibly simple to understand and easy to memorize for exams. Your answer length and detail MUST scale proportionally with the provided marks. Return ONLY raw markdown text, no JSON."
  },
  {
    role: "user",
    content: `Answer the following question in the context of the subject "${subjectTitle}".

Question: ${questionText}
Marks Allocated: ${marks}

Instructions based on marks:
- If 1-3 Marks: ${detailLevel === 'simple' ? 'Provide an extremely brief, one-sentence direct answer. No extra fluff.' : 'Provide a slightly more detailed short answer (3-4 sentences), including a quick example or definition breakdown.'}
- If 4-6 Marks: ${detailLevel === 'simple' ? 'Provide a concise summary (1 paragraph) focusing strictly on core concepts.' : 'Provide a comprehensive answer (2-3 paragraphs) with deep explanation.'} Include a Mermaid block diagram or flowchart if helpful.
- If Unknown: Provide a ${detailLevel === 'simple' ? 'short summary' : 'highly detailed, well-rounded'} answer.

If the question is worth 7 or more marks (e.g., 10 Marks), you MUST follow this EXACT format and structure for a high-scoring university exam answer:

## Objective
Generate the answer in a format suitable for engineering university examinations (JNTUA/JNTUK and similar universities). The generated answer should be structured, easy to study, and optimized for scoring high marks.

## Output Structure

Generate every 10-mark answer using the following sections in order. DO NOT prefix headings with numbers (e.g., do NOT use "1. Title"). DO NOT use slashes in headings (e.g., choose one word, do NOT use "Definition / Introduction").

### Title
* Display the topic/question as a large heading. Do NOT literally write "Title" as the heading.
* Do NOT use horizontal lines ('---') under the title or between sections.

### Definition (or Introduction)
* Use the exact heading "Definition" or "Introduction" (choose one based on context).
* ${detailLevel === 'simple' ? 'Extremely concise, 1-2 sentences maximum (30-50 words).' : '1 concise paragraph (80–120 words).'}
* Clearly define the concept.
* Explain why it is important.
* Mention where it is used.

### Diagram (or Flowchart, Architecture, etc.)
* You MUST ALWAYS generate a diagram for a 10-mark question. If a standard diagram doesn't exist, invent a logical conceptual block diagram or flowchart.
* Use a single appropriate heading like "Diagram", "Flowchart", or "Architecture".
* CRITICAL: You MUST wrap the diagram code inside a valid markdown code block with the 'mermaid' language identifier. (i.e. start with \`\`\`mermaid and end with \`\`\`). Do NOT output raw mermaid code without the code block.
* CRITICAL: Quote node labels containing special characters, parentheses, newlines, or spaces (e.g., id["Label (Extra Info)"]). Mermaid will fail to render if labels with parentheses or newlines are not enclosed in double quotes.
* Examples: Block Diagram, Architecture Diagram, Flowchart, State Diagram, Tree, Network Diagram, Process Flow.

### Main Explanation
* Split the answer into logical headings (e.g., "Working", "Components", "Steps"). Do NOT literally write "Main Explanation".
* Each heading should contain:
  * Explanation
  * Important points
  * Keywords highlighted in **bold**
  * Small examples where useful
* ${detailLevel === 'simple' ? 'Keep paragraphs extremely short (1-2 sentences). Prefer brief bullet points.' : 'Avoid large paragraphs. Use 2-3 short paragraphs per heading.'}

### Algorithm (or Procedure, Formula)
If the topic contains an Algorithm, Formula, Mathematical derivation, or Process:
* Use a single appropriate heading like "Algorithm" or "Formula".
* Generate: Numbered Steps OR Pseudo Code OR Mathematical Formula. Skip if not applicable.
* ${detailLevel === 'simple' ? 'Keep steps extremely brief.' : 'Provide detailed steps.'}

### Real-Life Example
* Use the exact heading "Real-Life Example".
* Always include one simple example.
* Use everyday situations understandable by beginners.
* ${detailLevel === 'simple' ? 'Keep it to a single short sentence.' : 'Explain the concept clearly in a short paragraph.'}

### Applications
* Use the exact heading "Applications".
* Include ${detailLevel === 'simple' ? '2–3' : '4–8'} applications. Display as bullet points.

### Advantages
* Use the exact heading "Advantages".
* Provide ${detailLevel === 'simple' ? '2–3' : '5–8'} advantages.

### Disadvantages
* Use the exact heading "Disadvantages".
* Provide ${detailLevel === 'simple' ? '2–3' : '3–6'} disadvantages or limitations.

### Comparison Table (If Applicable)
When the topic involves comparison, automatically generate a table.
* Use a relevant heading like "Comparison" or "Differences".
| Feature | A | B |
| ------- | - | - |
* ${detailLevel === 'simple' ? 'Keep table rows brief (max 3-4 rows).' : 'Provide comprehensive differences.'}
Examples: AI vs ML, LAN vs WAN, DFS vs BFS, TCP vs UDP. Skip if unnecessary.


### Conclusion
* Use the exact heading "Conclusion".
* Write a concise concluding paragraph (${detailLevel === 'simple' ? '15–30' : '40–80'} words).
* Summarize: Purpose, Importance, Future scope (if applicable).

## AI Writing Rules
The answer must be:
* University exam oriented
* Written in simple English
* Suitable for beginners
* Technically correct
* Easy to revise
* Well structured
* Free from unnecessary repetition

## Formatting Rules
Use:
* Large headings
* Sub-headings
* Numbered lists
* Bullet points
* Tables
* Bold keywords
* Callout boxes
* Syntax highlighted code
* Mermaid diagrams where appropriate
Avoid:
* Long paragraphs
* Walls of text
* Unnecessary AI-generated filler
* Horizontal lines or dividers ('---') anywhere in the output

## Adaptive Content
The AI should automatically detect the topic type.
Examples:
Programming → Include code, algorithm, output.
Networking → OSI diagram, protocol stack, packet flow.
Artificial Intelligence → Architecture, workflow, PEAS, examples.
DBMS → ER diagram, SQL examples, tables.
Operating Systems → Scheduling chart, memory diagram, algorithm.
Data Structures → Tree, graph, linked list diagrams.
Software Engineering → Models, SDLC diagrams, comparison tables.
Computer Networks → Topology diagrams, protocol flow.

## Quality Checks
Before displaying the answer, ensure:
✓ Definition included
✓ Diagram added if applicable
✓ Main explanation complete
✓ Algorithm included when relevant
✓ Real-life example present
✓ Applications listed
✓ Advantages listed
✓ Disadvantages listed
✓ Comparison table added when needed
✓ Conclusion present

Write the answer directly in Markdown. Do not include introductory filler like "Here is the answer". Just output the content.`
  }
];

export { extractJson };

// ========== SKILL ROADMAP PROMPTS ==========
export const generateRoadmapPrompt = (profile, availableRoadmaps) => [
  { role: "system", content: "You are an expert career counselor and tech industry mentor. Generate a personalized skill roadmap by selecting from a provided list of existing roadmap modules. Return ONLY valid JSON, no markdown." },
  { role: "user", content: `Generate a personalized learning curriculum for a student who wants to learn:
"${profile.career_goal}"

Here is the list of all available roadmap modules in the system (format is ID: Title):
${availableRoadmaps}

Select a sequence of 4 to 8 roadmap IDs from the list above that form the best learning path for this student. Order them from foundational to advanced.

Return ONLY a JSON array matching this exact schema:
[
  { "roadmap_id": "the-exact-id-from-the-list", "name": "The Title of the Roadmap", "why_important": "Why this specific module matters for their career goal", "estimated_time": "2-3 weeks" }
]
` }
];



// ========== PLACEMENT PROMPTS ==========
export const generateAptitudeQuestionsPrompt = (subcategory, difficulty, count = 5) => [
  { role: "system", content: "You are an expert aptitude test designer. Generate practice questions. Return ONLY valid JSON, no markdown." },
  { role: "user", content: `Generate ${count} ${difficulty} difficulty ${subcategory} aptitude questions for placement preparation.

Return ONLY a JSON array:
[
  {
    "question": "The question text",
    "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
    "correct_answer": "A",
    "explanation": "Step-by-step explanation of why the answer is correct"
  }
]

For ${subcategory}:
${subcategory === 'Quantitative Aptitude' ? '- Include: percentages, profit/loss, time & work, speed & distance, probability, number series, averages, ratios' : ''}
${subcategory === 'Logical Reasoning' ? '- Include: puzzles, syllogisms, coding-decoding, blood relations, directions, arrangements, patterns' : ''}
${subcategory === 'Verbal Ability' ? '- Include: reading comprehension, fill in the blanks, synonyms/antonyms, sentence correction, para jumbles' : ''}

Make questions realistic and varied. Each must have exactly 4 options.` }
];

export const generateTechnicalInterviewPrompt = (topic, difficulty, count = 5) => [
  { role: "system", content: "You are an expert technical interviewer at a top tech company. Generate interview questions. Return ONLY valid JSON, no markdown." },
  { role: "user", content: `Generate ${count} ${difficulty} difficulty technical interview questions on "${topic}".

Return ONLY a JSON array:
[
  {
    "question": "The interview question",
    "ideal_answer": "The comprehensive ideal answer",
    "difficulty": "${difficulty}"
  }
]

Make questions realistic — the kind asked at companies like Google, Amazon, Microsoft. Cover both conceptual understanding and practical application.` }
];

export const generateHRInterviewPrompt = (careerGoal) => [
  { role: "system", content: "You are an expert HR interviewer. Generate personalized HR interview questions. Return ONLY valid JSON, no markdown." },
  { role: "user", content: `Generate 8 HR interview questions personalized for someone targeting a "${careerGoal}" role.

Return ONLY a JSON array:
[
  { "question": "The HR question", "tips": "Tips for answering this question well" }
]

Include a mix of: personal background, strengths/weaknesses, career goals, teamwork, conflict resolution, company culture fit, situational questions.` }
];

export const evaluateHRAnswerPrompt = (question, answer) => [
  { role: "system", content: "You are an expert HR interview coach. Evaluate the candidate's answer and provide detailed, constructive feedback in Markdown." },
  { role: "user", content: `Evaluate this HR interview answer:

**Question:** ${question}
**Candidate's Answer:** ${answer}

Provide feedback in Markdown with these sections:
## Overall Assessment
Brief assessment (1-2 sentences).

## Confidence Score: X/10
Rate the answer's confidence and clarity.

## Strengths
What the candidate did well.

## Areas for Improvement
Specific improvements needed.

## Suggested Better Answer
A polished version of what they could say.

## Communication Tips
Tips to improve delivery and phrasing.

Be constructive and encouraging, but honest.` }
];

// ========== CODING PRACTICE PROMPTS ==========
export const generateCodingProblemPrompt = (language, topic, difficulty) => [
  { role: "system", content: "You are an expert competitive programmer and DSA instructor. Generate a coding problem. Return ONLY valid JSON, no markdown." },
  { role: "user", content: `Generate a ${difficulty} difficulty coding problem on "${topic}" to be solved in ${language}.

Return ONLY a valid JSON object:
{
  "title": "Problem Title",
  "statement": "Detailed problem statement explaining what needs to be done",
  "constraints": "Input constraints (e.g., 1 <= n <= 10^5)",
  "sample_input": "Example input",
  "sample_output": "Expected output for the example",
  "explanation": "Explanation of why this output is correct",
  "hints": "2-3 hints separated by newlines",
  "test_cases": "3 additional test cases formatted as Input: ... Output: ..."
}

Make the problem clear, well-defined, and solvable. Match the difficulty level appropriately.` }
];

export const analyzeCodingSolutionPrompt = (problem, code, language) => [
  { role: "system", content: "You are an expert code reviewer and competitive programmer. Analyze the submitted solution thoroughly in Markdown." },
  { role: "user", content: `Analyze this ${language} solution:

**Problem:** ${problem.title}
${problem.statement}

**Constraints:** ${problem.constraints}

**Submitted Code:**
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Provide analysis in Markdown with these sections:
## Correctness
Does the code solve the problem correctly? Check against sample cases.

## Logic Analysis
Explain the approach used. Is it sound?

## Time Complexity
What is the time complexity? Is it optimal?

## Space Complexity
What is the space complexity?

## Possible Optimizations
Better approaches or optimizations.

## Common Mistakes
Pitfalls or edge cases the code might miss.

## Better Approach
If there's a significantly better algorithm, explain it with pseudocode.

## Verdict
✅ Correct / ❌ Incorrect / ⚠️ Partially Correct

Be thorough but encouraging.` }
];

export const generateSimilarProblemsPrompt = (problemTitle, topic) => [
  { role: "system", content: "You are an expert DSA instructor. Generate similar practice problems. Return ONLY valid JSON, no markdown." },
  { role: "user", content: `Based on the problem "${problemTitle}" in the topic "${topic}", suggest 5 similar problems for further practice.

Return ONLY a JSON array:
[
  { "title": "Problem Title", "difficulty": "Easy/Medium/Hard", "brief": "One-line description" }
]` }
];


export const generateLearningLessonPrompt = (language, topic) => [
  {
    role: "system",
    content: "You are an expert programming tutor. Return ONLY valid JSON."
  },
  {
    role: "user",
    content: `Create a beginner-friendly lesson on "${topic}" in ${language}.
Return a JSON object exactly matching this schema:
{
  "title": "A catchy title for the lesson",
  "theory": "Markdown formatted explanation of the topic. Include small code snippets, analogies, and a supportive tone. Make it beginner friendly.",
  "problem_statement": "A simple coding problem that tests the user on this specific topic.",
  "sample_input": "Example input (or empty if not applicable)",
  "sample_output": "Expected output",
  "hints": "A helpful hint if they get stuck"
}`
  }
];

// ========== AI STUDY PLANNER PROMPTS ==========
export const generateStudyPlanPrompt = (profile, subjects, topics, stats, questionBanks) => [
  {
    role: "system",
    content: "You are an expert AI Study Planner. Generate a structured JSON study schedule based on user's current subjects and question banks. Return ONLY valid JSON, no markdown."
  },
  {
    role: "user",
    content: `Based on the following student data, generate a personalized study plan.
    
Student Profile: ${JSON.stringify(profile)}
Subjects: ${JSON.stringify(subjects)}
Topics (Some with completion stats): ${JSON.stringify(topics)}
Question Banks: ${JSON.stringify(questionBanks)}
Study Stats (Last opened): ${JSON.stringify(stats)}

Return ONLY a JSON object exactly matching this schema:
{
  "daily_plan": ["task 1", "task 2", "task 3"],
  "weekly_schedule": [
    { "day": "Monday", "focus": "Subject A", "tasks": ["Task 1", "Task 2"] },
    { "day": "Tuesday", "focus": "Subject B", "tasks": ["Task 1", "Task 2"] }
    // ... up to Sunday
  ],
  "priority_topics": ["Topic 1", "Topic 2"],
  "revision_tasks": ["Revision Task 1", "Revision Task 2"]
}`
  }
];

// ========== FLASHCARDS PROMPT ==========
export const generateFlashcardsPrompt = (topicTitle, topicContent) => [
  {
    role: "system",
    content: "You are an expert AI Flashcard Creator. Generate a structured JSON array of flashcards. Return ONLY a valid JSON array, no markdown wrappers."
  },
  {
    role: "user",
    content: `Based on the following topic and its content, generate 10-15 high-yield study flashcards.
    
CRITICAL CONSTRAINTS:
1. Make the "back" (answer) clear and understandable, but concise.
2. It must capture the core concept without losing crucial meaning.
3. Avoid massive walls of text or exhaustive long lists. If you must use a list, limit it to 3-4 key bullet points.
4. Aim for 1-3 sentences maximum for any definition or explanation.

Topic: ${topicTitle}
Content: ${topicContent}

Return ONLY a JSON array where each object exactly matches this schema:
[
  { "front": "Question or term", "back": "Answer or definition (Concise but clear)", "tag": "category (e.g. definition, concept)" },
  ...
]`
  }
];

// ========== AI ASSISTANT PROMPT ==========
export const callAIAssistantStream = async (messages, currentContext, onChunk) => {
  const isCodingMentor = currentContext.includes("practicing coding");
  
  const systemContent = isCodingMentor 
    ? `You are the StudyMapper AI Coding Mentor. You act as an expert pair programmer and algorithmic guide.
Provide detailed explanations of algorithms, detect logical errors, explain compiler errors, analyze time/space complexity, and suggest optimizations.
Be concise, practical, and highly responsive to the student's coding needs.
Use markdown for formatting. Include code blocks where helpful.`
    : `You are the StudyMapper AI Assistant, a universal AI companion integrated directly into the student's learning platform.
You act as a helpful mentor, tutor, and guide. 
Be concise, practical, and highly responsive to the student's needs.
Use markdown for formatting. Include code blocks, tables, and bullet points where helpful.`;

  // Append system prompt for context
  const fullMessages = [
    {
      role: 'system',
      content: `${systemContent}

CURRENT CONTEXT (This is where the student currently is in the app):
${currentContext}`
    },
    ...messages
  ];
  return await callOpenRouterStream(fullMessages, onChunk);
};

export const generatePlanFromTimetablePrompt = () => {
  return `You are an expert AI Study Planner. I have uploaded an image of my class timetable or exam schedule. 
Please analyze the image, extract the subjects, exams, or classes, and generate a structured JSON weekly study schedule for me.

Return ONLY a JSON object exactly matching this schema:
{
  "daily_plan": ["task 1", "task 2", "task 3"],
  "weekly_schedule": [
    { "day": "Monday", "focus": "Subject A", "tasks": ["Task 1", "Task 2"] },
    { "day": "Tuesday", "focus": "Subject B", "tasks": ["Task 1", "Task 2"] }
  ],
  "priority_topics": ["Topic 1 from timetable", "Topic 2 from timetable"],
  "revision_tasks": ["Revision Task 1", "Revision Task 2"]
}`;
};
