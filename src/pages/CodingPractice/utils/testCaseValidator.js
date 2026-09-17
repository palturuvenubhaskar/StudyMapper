export function normalizeOutput(output) {
  if (output === null || output === undefined) return '';
  if (typeof output !== 'string') return output;
  
  try {
    return JSON.parse(output);
  } catch(e) {
    return output.trim().replace(/\r\n/g, '\n');
  }
}

export function compareOutputs(actual, expected) {
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);

  if (typeof normActual !== typeof normExpected) {
     return JSON.stringify(normActual) === JSON.stringify(normExpected);
  }

  if (typeof normActual === 'object') {
    return JSON.stringify(normActual) === JSON.stringify(normExpected);
  }

  return normActual === normExpected;
}
