import { useState, useEffect } from 'react';

// Global cache to avoid reloading Pyodide on every re-render or remount
let pyodideInstance = null;
let globalError = null;
let loadPromise = null;

export function usePyodide() {
  const [pyodide, setPyodide] = useState(pyodideInstance);
  const [loading, setLoading] = useState(!pyodideInstance);
  const [error, setError] = useState(globalError);

  useEffect(() => {
    if (pyodideInstance) {
      setPyodide(pyodideInstance);
      setLoading(false);
      return;
    }

    if (!loadPromise) {
      loadPromise = (async () => {
        try {
          // Dynamically load the Pyodide script if not already present
          if (!document.getElementById('pyodide-script')) {
            const script = document.createElement('script');
            script.id = 'pyodide-script';
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
            document.head.appendChild(script);

            await new Promise((resolve, reject) => {
              script.onload = resolve;
              script.onerror = () => reject(new Error('Failed to load Pyodide script'));
            });
          }

          // Initialize Pyodide
          pyodideInstance = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
          });
          
          return pyodideInstance;
        } catch (err) {
          globalError = err.message;
          throw err;
        }
      })();
    }

    loadPromise
      .then((instance) => {
        setPyodide(instance);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

  }, []);

  // runPython function to execute code and capture stdout/stderr
  const runPython = async (code) => {
    if (!pyodideInstance) {
      return { stdout: '', stderr: '', error: 'Pyodide is not loaded yet', success: false };
    }

    try {
      // Clear previous streams
      pyodideInstance.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

      // We run the user's combined harness code
      await pyodideInstance.runPythonAsync(code);
      
      const stdout = pyodideInstance.runPython('sys.stdout.getvalue()');
      const stderr = pyodideInstance.runPython('sys.stderr.getvalue()');
      
      return { stdout, stderr, error: null, success: true };
    } catch (err) {
      const stdout = pyodideInstance.runPython('sys.stdout.getvalue()');
      const stderr = pyodideInstance.runPython('sys.stderr.getvalue()');
      return { 
        stdout, 
        stderr: stderr + (stderr ? '\\n' : '') + err.message, 
        error: err.message, 
        success: false 
      };
    }
  };

  return { pyodide, loading, error, runPython };
}
