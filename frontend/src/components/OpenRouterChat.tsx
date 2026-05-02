// OpenRouterChat.tsx
// Chat component using OpenRouter API (Llama 4 Scout, Qwen3.5 9B, MiMo-V2-Flash)
import { useState, useRef, useEffect, useCallback } from 'react';
// import { useTheme } from '../ThemeContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const FREE_CODING_MODEL = 'meta-llama/llama-3.3-70b-instruct'; // Llama-3.3-70B-Instruct, best for coding and chat

export default function OpenRouterChat() {
  // const { theme } = useTheme();
  // const isLight = theme === 'light'; // Unused, can be re-added if needed

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => textareaRef.current?.focus(), 50);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Limit input to 300 characters to reduce LLM cost
  const MAX_INPUT_LENGTH = 300;

  // Debounce sendMessage to prevent rapid repeated calls
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const sendMessage = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;
    if (trimmedInput.length > MAX_INPUT_LENGTH) {
      setError(`Prompt too long. Please shorten to ${MAX_INPUT_LENGTH} characters or less.`);
      return;
    }
    // Warn if user is sending the same prompt as their last message
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg && lastUserMsg.content === trimmedInput) {
      setError('You just sent this prompt. Please modify your question to avoid duplicate AI responses.');
      return;
    }
    setIsLoading(true);
    setError(null);
    const userMsg: Message = { role: 'user', content: trimmedInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    try {
      const res = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: FREE_CODING_MODEL,
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMsg.content }
          ],
          max_tokens: 1024,
        })
      });
      if (!res.ok) throw new Error(`OpenRouter returned ${res.status}`);
      const data = await res.json();
      const assistantMsg = data.choices?.[0]?.message?.content || 'No response.';
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMsg }]);
    } catch (e: any) {
      setError(e.message || 'Error contacting OpenRouter');
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  // Debounced handler for form submit
  const handleDebouncedSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      sendMessage();
    }, 500); // 500ms debounce
  };

  return (
    <>
      {/* Floating Chat Icon Button */}
      {!isOpen && (
        <button
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center text-white text-3xl transition-all duration-200"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.18)' }}
          onClick={() => setIsOpen(true)}
          title="Open Chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 0 1-4.37-.98L3 20l.98-3.92A7.97 7.97 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 bg-white dark:bg-gray-900 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col" style={{ minHeight: 420, maxHeight: 520 }}>
          {/* Header with Close Icon */}
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white rounded-t-xl">
            <span className="font-bold text-lg">OpenRouter Chat</span>
            <button
              className="ml-2 p-1 rounded-full hover:bg-blue-700 focus:outline-none"
              onClick={() => setIsOpen(false)}
              title="Close Chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ maxHeight: 320 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <span className={`inline-block px-3 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}>{m.content}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <form className="flex items-end gap-2 p-3 border-t dark:border-gray-700" onSubmit={handleDebouncedSend}>
            <textarea
              ref={textareaRef}
              className="flex-1 resize-none rounded-lg border p-2 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400"
              rows={2}
              value={input}
              onChange={e => {
                if (e.target.value.length <= MAX_INPUT_LENGTH) setInput(e.target.value);
              }}
              placeholder={`Ask coding/system design questions... (max ${MAX_INPUT_LENGTH} chars)`}
              disabled={isLoading}
              style={{ minHeight: 38, maxHeight: 80 }}
              maxLength={MAX_INPUT_LENGTH}
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-60" disabled={isLoading || !input.trim()}>
              Send
            </button>
          </form>
          {error && <div className="text-red-500 text-xs px-4 pb-2">{error}</div>}
        </div>
      )}
    </>
  );
}
