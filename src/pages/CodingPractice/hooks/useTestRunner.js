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

  const runTests = async (code, testCases, language = 'Python', onProgress) => {
    setStatus('running');
    setResults([]);
    const startTime = performance.now();
    let allPassed = true;
    const currentResults = [];

    const isPython = language.toLowerCase() === 'python';

    if (isPython && !pyodide) return;

    for (const testCase of testCases) {
      const tStart = performance.now();
      let stdout = '';
      let stderr = '';
      let success = false;

      if (isPython) {
        const functionName = getFunctionName(code);
        const inputJson = JSON.stringify(testCase.input).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const harness = `
import json
import sys

# User code
${code}

# Test execution
try:
    _input_args = json.loads('${inputJson}')
    result = ${functionName}(*_input_args)
    print(json.dumps(result))
except Exception as e:
    import traceback
    sys.stderr.write(traceback.format_exc())
`;
        const result = await runPython(harness);
        stdout = result.stdout;
        stderr = result.stderr;
        success = result.success;
      } else {
        // Use Wandbox API for other languages
        const langMap = {
          'c': 'gcc-head-c',
          'c++': 'gcc-head',
          'cpp': 'gcc-head',
          'java': 'openjdk-jdk-22+36',
          'javascript': 'nodejs-20.17.0',
        };
        const compiler = langMap[language.toLowerCase()] || 'gcc-head-c';
        
        try {
          const res = await fetch('https://wandbox.org/api/compile.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              compiler: compiler,
              code: code,
              stdin: typeof testCase.input === 'string' ? testCase.input : JSON.stringify(testCase.input)
            })
          });
          
          if (!res.ok) {
            stderr = `API Error: ${res.statusText}`;
          } else {
            const data = await res.json();
            stdout = data.program_output || data.compiler_output || '';
            stderr = data.program_error || '';
            success = data.status === "0";
            
            if (data.compiler_error) {
               stderr = data.compiler_error + '\n' + stderr;
               if (!stdout && data.status !== "0") {
                  success = false;
               }
            }
          }
        } catch (e) {
          stderr = e.message;
        }
      }

      const tEnd = performance.now();
      const expectedOutput = testCase.expected !== undefined ? testCase.expected : testCase.expected_output;
      const passed = success && compareOutputs(stdout, expectedOutput);
      if (!passed) allPassed = false;

      currentResults.push({
        ...testCase,
        passed,
        actual: stdout,
        stderr: stderr,
        executionTime: Math.round(tEnd - tStart)
      });

      // Update UI progressively
      setResults([...currentResults]);
      if (onProgress) onProgress(currentResults);
    }

    const endTime = performance.now();
    setRunTime(Math.round(endTime - startTime));
    setStatus(allPassed ? 'passed' : 'failed');
  };

  return { results, status, runTime, runTests, reset };
}
