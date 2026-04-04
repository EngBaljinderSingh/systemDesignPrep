import { useState, useCallback } from 'react';
import type { AxiosError } from 'axios';
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

const STARTERS: Record<string, string> = {
  java: `// Java Solution
import java.util.*;

public class Solution {
    public int solve(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
  python: `# Python Solution
from typing import List

class Solution:
    def solve(self, nums: List[int]) -> int:
        # Write your solution here
        return 0`,
  javascript: `// JavaScript Solution
/**
 * @param {number[]} nums
 * @return {number}
 */
var solve = function(nums) {
    // Write your solution here
    return 0;
};`,
  typescript: `// TypeScript Solution
function solve(nums: number[]): number {
    // Write your solution here
    return 0;
}`,
  cpp: `// C++ Solution
#include <vector>
using namespace std;

class Solution {
public:
    int solve(vector<int>& nums) {
        // Write your solution here
        return 0;
    }
};`,
  go: `// Go Solution
package main

func solve(nums []int) int {
    // Write your solution here
    return 0
}`,
  csharp: `// C# Solution
using System;
using System.Collections.Generic;

public class Solution {
    public int Solve(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
};

interface AiPanel {
  type: 'review' | 'hint';
  content: string;
  loading: boolean;
  isError?: boolean;
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

        {/* Monaco Editor */}
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
