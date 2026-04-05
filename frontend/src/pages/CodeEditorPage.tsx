import { useState, useCallback, useEffect, useRef } from 'react';
import axios, { type AxiosError } from 'axios';
import Editor from '@monaco-editor/react';
import { interviewApi } from '../api/interviewApi';

function extractErrorMessage(err: unknown): string {
  const axiosErr = err as AxiosError<{ message?: string }>;
  if (axiosErr?.response?.data?.message) return axiosErr.response.data.message;
  if (axiosErr?.message) return axiosErr.message;
  return 'Unknown error — check that the backend is running.';
}

const LANGUAGES = [
  { id: 'java', label: 'Java', monacoId: 'java' },
  { id: 'python', label: 'Python', monacoId: 'python' },
  { id: 'javascript', label: 'JavaScript', monacoId: 'javascript' },
  { id: 'typescript', label: 'TypeScript', monacoId: 'typescript' },
  { id: 'cpp', label: 'C++', monacoId: 'cpp' },
  { id: 'go', label: 'Go', monacoId: 'go' },
  { id: 'csharp', label: 'C#', monacoId: 'csharp' },
];

// Maps our language IDs to Piston language names and filenames.
// Versions are resolved dynamically from /piston/api/v2/runtimes at runtime.
const PISTON_LANGUAGES: Record<string, { language: string; filename: string }> = {
  java:       { language: 'java',       filename: 'Solution.java' },
  python:     { language: 'python',     filename: 'solution.py'   },
  javascript: { language: 'javascript', filename: 'solution.js'   },
  typescript: { language: 'typescript', filename: 'solution.ts'   },
  cpp:        { language: 'c++',        filename: 'solution.cpp'  },
  go:         { language: 'go',         filename: 'solution.go'   },
  csharp:     { language: 'mono',       filename: 'solution.cs'   },
};

// Fetches installed runtimes once and returns a version map keyed by piston language name.
async function fetchRuntimeVersions(): Promise<Record<string, string>> {
  try {
    const { data } = await axios.get<{ language: string; version: string }[]>('/piston/api/v2/runtimes');
    const map: Record<string, string> = {};
    for (const r of data) map[r.language] = r.version;
    return map;
  } catch {
    return {};
  }
}

const STARTERS: Record<string, string> = {
  java: `import java.util.*;

public class Solution {
    public int solve(int[] nums) {
        // Write your solution here
        return nums[0];
    }

    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.solve(new int[]{1, 2, 3, 4, 5}));
    }
}`,
  python: `from typing import List

class Solution:
    def solve(self, nums: List[int]) -> int:
        # Write your solution here
        return nums[0]

if __name__ == "__main__":
    s = Solution()
    print(s.solve([1, 2, 3, 4, 5]))`,
  javascript: `function solve(nums) {
    // Write your solution here
    return nums[0];
}

console.log(solve([1, 2, 3, 4, 5]));`,
  typescript: `function solve(nums: number[]): number {
    // Write your solution here
    return nums[0];
}

console.log(solve([1, 2, 3, 4, 5]));`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int solve(vector<int>& nums) {
        // Write your solution here
        return nums[0];
    }
};

int main() {
    Solution s;
    vector<int> nums = {1, 2, 3, 4, 5};
    cout << s.solve(nums) << endl;
    return 0;
}`,
  go: `package main

import "fmt"

func solve(nums []int) int {
    // Write your solution here
    return nums[0]
}

func main() {
    fmt.Println(solve([]int{1, 2, 3, 4, 5}))
}`,
  csharp: `using System;
using System.Collections.Generic;

public class Solution {
    public int Solve(int[] nums) {
        // Write your solution here
        return nums[0];
    }

    public static void Main(string[] args) {
        var s = new Solution();
        Console.WriteLine(s.Solve(new int[]{1, 2, 3, 4, 5}));
    }
}`,
};

interface AiPanel {
  type: 'review' | 'hint';
  content: string;
  loading: boolean;
  isError?: boolean;
}

interface RunOutput {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  loading: boolean;
}

export interface CodeEditorProps {
  problemTitle?: string;
  problemDescription?: string;
  onClose?: () => void;
}

export default function CodeEditorPage({ problemTitle, problemDescription, onClose }: CodeEditorProps) {
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState(STARTERS['java']);
  const [aiPanel, setAiPanel] = useState<AiPanel | null>(null);
  const [hintLevel, setHintLevel] = useState<'GENTLE' | 'MEDIUM' | 'DIRECT'>('GENTLE');
  const [runOutput, setRunOutput] = useState<RunOutput | null>(null);
  const runtimeVersions = useRef<Record<string, string>>({});

  useEffect(() => {
    fetchRuntimeVersions().then((v) => { runtimeVersions.current = v; });
  }, []);

  const switchLanguage = useCallback((lang: string) => {
    setLanguage(lang);
    setCode(STARTERS[lang] ?? '');
  }, []);

  const reviewCode = useCallback(async () => {
    setAiPanel({ type: 'review', content: '', loading: true });
    try {
      const { data } = await interviewApi.reviewCode({
        code,
        language,
        problemTitle: problemTitle ?? 'Unknown Problem',
        problemDescription: problemDescription ?? '',
      });
      setAiPanel({ type: 'review', content: data.review, loading: false });
    } catch (err) {
      setAiPanel({ type: 'review', content: extractErrorMessage(err), loading: false, isError: true });
    }
  }, [code, language, problemTitle, problemDescription]);

  const runCode = useCallback(async () => {
    const pistonLang = PISTON_LANGUAGES[language];
    if (!pistonLang) return;
    setRunOutput({ stdout: '', stderr: '', exitCode: null, loading: true });

    // Use dynamically discovered version, refresh if cache is empty
    let versions = runtimeVersions.current;
    if (!versions[pistonLang.language]) {
      versions = await fetchRuntimeVersions();
      runtimeVersions.current = versions;
    }
    const version = versions[pistonLang.language];
    if (!version) {
      setRunOutput({
        stdout: '',
        stderr: `Runtime "${pistonLang.language}" is not installed yet.\nWait ~60s after first \`docker compose up\` for piston-init to finish.\nOr check: http://localhost:2000/api/v2/runtimes`,
        exitCode: -1,
        loading: false,
      });
      return;
    }

    try {
      const { data } = await axios.post('/piston/api/v2/execute', {
        language: pistonLang.language,
        version,
        files: [{ name: pistonLang.filename, content: code }],
      });
      const run = data.run as { stdout: string; stderr: string; code: number | null };
      setRunOutput({ stdout: run.stdout ?? '', stderr: run.stderr ?? '', exitCode: run.code, loading: false });
    } catch (err) {
      const msg = extractErrorMessage(err);
      setRunOutput({
        stdout: '',
        stderr: msg.includes('Network Error') || msg.includes('502') || msg.includes('503')
          ? 'Code runner not available.\nRun: docker compose up --build\nPiston initialises on first start — wait ~30s for runtimes to install.'
          : msg,
        exitCode: -1,
        loading: false,
      });
    }
  }, [code, language]);

  const getHint = useCallback(async () => {
    setAiPanel({ type: 'hint', content: '', loading: true });
    try {
      const { data } = await interviewApi.getHint({
        code,
        language,
        problemTitle: problemTitle ?? 'Unknown Problem',
        problemDescription: problemDescription ?? '',
        hintLevel,
      });
      setAiPanel({ type: 'hint', content: data.hint, loading: false });
    } catch (err) {
      setAiPanel({ type: 'hint', content: extractErrorMessage(err), loading: false, isError: true });
    }
  }, [code, language, problemTitle, problemDescription, hintLevel]);

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-surface-light border-b border-gray-700 flex-shrink-0">
        {/* Problem title */}
        <span className="text-sm font-medium text-white truncate max-w-xs">
          {problemTitle ?? 'Code Editor'}
        </span>

        {/* Language selector */}
        <div className="flex gap-1 ml-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => switchLanguage(lang.id)}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                language === lang.id
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Hint level */}
          <select
            value={hintLevel}
            onChange={(e) => setHintLevel(e.target.value as 'GENTLE' | 'MEDIUM' | 'DIRECT')}
            className="text-xs px-2 py-1 bg-surface border border-gray-600 rounded text-gray-300 focus:outline-none"
          >
            <option value="GENTLE">Gentle hint</option>
            <option value="MEDIUM">Medium hint</option>
            <option value="DIRECT">Direct hint</option>
          </select>
          <button
            onClick={runCode}
            className="text-xs px-3 py-1.5 bg-emerald-600/80 text-white rounded hover:bg-emerald-500/80 font-medium"
          >
            ▶ Run
          </button>
          <button
            onClick={getHint}
            className="text-xs px-3 py-1.5 bg-yellow-600/80 text-white rounded hover:bg-yellow-500/80 font-medium"
          >
            💡 Get Hint
          </button>
          <button
            onClick={reviewCode}
            className="text-xs px-3 py-1.5 bg-primary text-white rounded hover:bg-primary-dark font-medium"
          >
            🤖 AI Review
          </button>
          {onClose && (
            <button onClick={onClose} className="text-gray-500 hover:text-white text-lg leading-none ml-1">×</button>
          )}
        </div>
      </div>

      {/* Editor + AI panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Problem description sidebar */}
        {problemDescription && (
          <div className="w-72 flex-shrink-0 border-r border-gray-700 overflow-y-auto p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Problem</h3>
            <h4 className="text-sm font-semibold text-white mb-2">{problemTitle}</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{problemDescription}</p>
          </div>
        )}

        {/* Monaco Editor + Output */}
        <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={LANGUAGES.find((l) => l.id === language)?.monacoId ?? 'java'}
            value={code}
            onChange={(val) => setCode(val ?? '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 4,
              lineNumbers: 'on',
              automaticLayout: true,
              suggestOnTriggerCharacters: true,
              formatOnPaste: true,
              padding: { top: 12 },
            }}
          />
        </div>

        {/* Output panel */}
        {runOutput && (
          <div className="flex-shrink-0 border-t border-gray-700 bg-gray-950 flex flex-col" style={{ height: '160px' }}>
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-700 flex-shrink-0">
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                ▶ Output
                {!runOutput.loading && runOutput.exitCode !== null && (
                  <span className={runOutput.exitCode === 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {runOutput.exitCode === 0 ? '✓ exit 0' : `✗ exit ${runOutput.exitCode}`}
                  </span>
                )}
              </span>
              <button onClick={() => setRunOutput(null)} className="text-gray-600 hover:text-white text-base leading-none">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
              {runOutput.loading ? (
                <span className="text-gray-500 animate-pulse">Running…</span>
              ) : (
                <>
                  {runOutput.stdout && <pre className="text-gray-200 whitespace-pre-wrap">{runOutput.stdout}</pre>}
                  {runOutput.stderr && <pre className="text-red-400 whitespace-pre-wrap">{runOutput.stderr}</pre>}
                  {!runOutput.stdout && !runOutput.stderr && <span className="text-gray-600 italic">(no output)</span>}
                </>
              )}
            </div>
          </div>
        )}
        </div>

        {/* AI panel */}
        {aiPanel && (
          <div className="w-80 flex-shrink-0 border-l border-gray-700 bg-surface-light flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              <span className="text-xs font-semibold text-white">
                {aiPanel.type === 'review' ? '🤖 AI Code Review' : '💡 Hint'}
              </span>
              <button onClick={() => setAiPanel(null)} className="text-gray-500 hover:text-white">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {aiPanel.loading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span className="animate-spin">⟳</span> Thinking…
                </div>
              ) : aiPanel.isError ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-red-400 text-sm">
                    <span className="text-lg leading-none mt-0.5">⚠</span>
                    <p>{aiPanel.content}</p>
                  </div>
                  <div className="text-xs text-gray-500 border-t border-gray-700 pt-3 space-y-1">
                    <p className="font-medium text-gray-400">To enable AI features:</p>
                    <p>• Get a free <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-primary underline">Gemini API key</a> (1 500 req/day)</p>
                    <p>• Add it to your <code className="text-yellow-400">.env</code> file as <code className="text-yellow-400">GEMINI_API_KEY=…</code></p>
                    <p>• Run <code className="text-yellow-400">docker compose up --build</code></p>
                  </div>
                </div>
              ) : (
                <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{aiPanel.content}</pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
