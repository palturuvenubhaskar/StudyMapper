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

  /** Safe base64 encoding that handles Unicode */
  const toBase64 = (str) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch {
      return btoa(str);
    }
  };

  /** Extract the first top-level function name from Python code */
  const getFunctionName = (code) => {
    // Match function definitions at the start of a line (not indented = top-level)
    const matches = [...code.matchAll(/^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/gm)];
    if (matches.length === 0) return null;
    const names = matches.map(m => m[1]);
    // Skip dunder methods, prefer the main solution function
    return names.find(n => !n.startsWith('__')) || names[0];
  };

  /**
   * Build a Python harness that calls the user's function with args.
   * Handles in-place modification (returns None) by checking mutable args.
   */
  const buildFunctionHarness = (code, functionName, inputBase64) => `
import json, sys, base64

# User code
${code}

# Test harness — function-based execution
try:
    _raw = base64.b64decode('${inputBase64}').decode('utf-8')
    _input_args = json.loads(_raw)
    if not isinstance(_input_args, list):
        _input_args = [_input_args]

    # Keep references to mutable args (lists/dicts) for in-place problems
    _mutable_refs = [a for a in _input_args if isinstance(a, (list, dict))]

    _result = ${functionName}(*_input_args)

    # If function returns None and a mutable arg was passed, assume in-place modification
    if _result is None and _mutable_refs:
        _result = _mutable_refs[0]

    print(json.dumps(_result))
except Exception as e:
    import traceback
    sys.stderr.write(traceback.format_exc())
`;

  /**
   * Build a Python harness that simulates stdin for input() calls.
   * Used for fundamental topics (Hello World, Pattern Printing, etc.)
   */
  const buildStdinHarness = (code, stdinBase64) => `
import sys, io, base64

# Simulate stdin for input() calls
try:
    _stdin_data = base64.b64decode('${stdinBase64}').decode('utf-8')
    sys.stdin = io.StringIO(_stdin_data)
except:
    pass

# User code
${code}
`;

  /**
   * Determine the execution mode and build the appropriate harness.
   * - If user code has a function AND input is an array → function call mode
   * - If user code has a function AND input is a string → try to parse as JSON args for function call
   * - If user code has no function → stdin/stdout mode
   */
  const buildHarness = (code, testCase) => {
    const functionName = getFunctionName(code);
    const inputData = testCase.input;

    // Mode 1: Function + array input (local test cases like { input: [[0,1,0,3,12]], expected: ... })
    if (functionName && Array.isArray(inputData)) {
      const inputBase64 = toBase64(JSON.stringify(inputData));
      return buildFunctionHarness(code, functionName, inputBase64);
    }

    // Mode 2: Function + string input (AI-generated test cases like { input: "5", expected_output: "120" })
    if (functionName && typeof inputData === 'string') {
      // Try to parse the string as JSON to get function arguments
      let parsedArgs;
      try {
        parsedArgs = JSON.parse(inputData);
      } catch {
        // Not valid JSON — could be multi-line stdin like "5\n10"
        parsedArgs = null;
      }

      if (parsedArgs !== null) {
        // Wrap in array if it's a single value (e.g., "5" → [5])
        const args = Array.isArray(parsedArgs) ? parsedArgs : [parsedArgs];
        const inputBase64 = toBase64(JSON.stringify(args));
        return buildFunctionHarness(code, functionName, inputBase64);
      }

      // Multi-line or non-JSON string input — could be stdin for the function
      // Try function mode with the raw string as a single string arg
      if (!inputData.includes('\n')) {
        const inputBase64 = toBase64(JSON.stringify([inputData]));
        return buildFunctionHarness(code, functionName, inputBase64);
      }

      // Fall through to stdin mode
    }

    // Mode 3: Stdin/stdout mode (no function, or complex string input)
    const stdinStr = inputData == null ? ''
      : typeof inputData === 'string' ? inputData
      : Array.isArray(inputData)
        ? inputData.map(v => typeof v === 'string' ? v : JSON.stringify(v)).join('\n')
        : String(inputData);
    const stdinBase64 = toBase64(stdinStr);
    return buildStdinHarness(code, stdinBase64);
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
        const harness = buildHarness(code, testCase);
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

