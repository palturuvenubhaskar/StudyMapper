export function normalizeOutput(output) {
  if (output === null || output === undefined) return '';
  if (typeof output !== 'string') return output;
  
  // Trim whitespace and normalize line endings
  const trimmed = output.trim().replace(/\r\n/g, '\n');
  if (!trimmed) return '';

  // Try to parse as JSON (handles arrays, objects, booleans, numbers)
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

export function compareOutputs(actual, expected) {
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);

  // Direct equality (handles primitives and same-type matches)
  if (normActual === normExpected) return true;

  // Both are objects/arrays → deep compare via JSON
  if (typeof normActual === 'object' && normActual !== null &&
      typeof normExpected === 'object' && normExpected !== null) {
    return JSON.stringify(normActual) === JSON.stringify(normExpected);
  }

  // Type mismatch — stringify both and compare
  // Handles cases like stdout "true" vs expected boolean true,
  // or stdout "42" vs expected number 42
  const strActual = String(normActual).trim();
  const strExpected = String(normExpected).trim();
  if (strActual === strExpected) return true;

  // Try parsing both as JSON and deep compare
  // Handles cases like stdout "[1, 2, 3]\n" vs expected [1,2,3]
  try {
    const jsonActual = typeof normActual === 'string' ? JSON.parse(normActual) : normActual;
    const jsonExpected = typeof normExpected === 'string' ? JSON.parse(normExpected) : normExpected;
    return JSON.stringify(jsonActual) === JSON.stringify(jsonExpected);
  } catch {
    // Fall through
  }

  // Multiline output — compare line by line (ignore trailing empty lines)
  if (strActual.includes('\n') || strExpected.includes('\n')) {
    const linesActual = strActual.split('\n').map(l => l.trimEnd());
    const linesExpected = strExpected.split('\n').map(l => l.trimEnd());
    // Remove trailing empty lines
    while (linesActual.length && !linesActual[linesActual.length - 1]) linesActual.pop();
    while (linesExpected.length && !linesExpected[linesExpected.length - 1]) linesExpected.pop();
    if (linesActual.length === linesExpected.length &&
        linesActual.every((line, i) => line === linesExpected[i])) {
      return true;
    }
  }

  return false;
}

