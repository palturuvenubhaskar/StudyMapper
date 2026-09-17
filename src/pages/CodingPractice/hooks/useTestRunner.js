import { useState } from 'react';
import { compareOutputs } from '../utils/testCaseValidator';

export function useTestRunner(pyodideConfig) {
  const { runPython, pyodide } = pyodideConfig;
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle', 'running', 'passed', 'failed'
  const [runTime, setRunTime] = useState(0);

  const reset = () => {
    setResults([]);
    setStatus('idle');
    setRunTime(0);
  };

  const getFunctionName = (code) => {
    // Basic regex to find the first function defined (e.g. def twoSum(...): )
    const match = code.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    return match ? match[1] : 'solution';
  };

  const runTests = async (code, testCases) => {
    if (!pyodide) return;

    setStatus('running');
    setResults([]);
    const startTime = performance.now();
    let allPassed = true;
    const currentResults = [];
    const functionName = getFunctionName(code);

    for (const testCase of testCases) {
      // Safely escape the json for python string literal
      const inputJson = JSON.stringify(testCase.input).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      
      const harness = `
import json
import sys

# User code
${code}

# Test execution
try:
    _input_args = json.loads('${inputJson}')
    # All test case inputs are defined as arrays of arguments
    result = ${functionName}(*_input_args)
    print(json.dumps(result))
except Exception as e:
    import traceback
    sys.stderr.write(traceback.format_exc())
`;

      const tStart = performance.now();
      const result = await runPython(harness);
      const tEnd = performance.now();
      
      const passed = result.success && compareOutputs(result.stdout, testCase.expected);
      if (!passed) allPassed = false;

      currentResults.push({
        ...testCase,
        passed,
        actual: result.stdout,
        stderr: result.stderr,
        executionTime: Math.round(tEnd - tStart)
      });

      // Update UI progressively
      setResults([...currentResults]);
    }

    const endTime = performance.now();
    setRunTime(Math.round(endTime - startTime));
    setStatus(allPassed ? 'passed' : 'failed');
  };

  return { results, status, runTime, runTests, reset };
}
