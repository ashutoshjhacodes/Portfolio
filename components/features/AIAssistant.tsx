'use client';

// components/features/AIAssistant.tsx
// Floating AI Assistant chat interface with session history, loading states, and error handling.
// Requirements: 9.1, 9.2, 9.6, 9.7, 9.8

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, scaleIn, useReducedMotion } from '@/lib/animations';
import { validateChatInput } from '@/lib/utils/validation';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Listen for custom event to open AI assistant with pre-filled message
  useEffect(() => {
    const handleOpenAI = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      const message = customEvent.detail?.message;
      if (message) {
        setIsOpen(true);
        setInput(message);
        setError(null);
        setValidationError(null);
      }
    };

    window.addEventListener('open-ai-assistant', handleOpenAI);
    return () => window.removeEventListener('open-ai-assistant', handleOpenAI);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setError(null);

    // Validate input (1-500 chars, not empty/whitespace-only)
    const validation = validateChatInput(input);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid input');
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Keep input on failure, clear on success attempt
    const currentInput = input;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput.trim(),
          sessionHistory: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // API failure: retain user's question in input, show error
        setError(data.error || 'AI assistant is temporarily unavailable');
        setInput(currentInput);
        // Remove the user message we optimistically added since the request failed
        setMessages(prev => prev.slice(0, -1));
      } else {
        // Success: clear input, add assistant response
        setInput('');
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch {
      // Network error: retain input, show error
      setError('AI assistant is temporarily unavailable');
      setInput(currentInput);
      // Remove the user message we optimistically added
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [input, messages]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    setError(null);
    setValidationError(null);
  };

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        exit: 'hidden',
      };

  return (
    <>
      {/* Floating button - accessible from all sections */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors"
        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant - Ask About Ashutosh'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </motion.button>

      {/* Chat interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={prefersReducedMotion ? undefined : scaleIn}
            {...animationProps}
            className="fixed bottom-24 right-6 z-50 flex h-[480px] w-[360px] max-w-[calc(100vw-2rem)] flex-col rounded-xl border border-[#27272A] bg-[#09090B] shadow-2xl"
            role="dialog"
            aria-label="AI Assistant Chat"
            aria-modal="false"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#27272A] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
                <h2 className="text-sm font-medium text-white">Ask About Ashutosh</h2>
              </div>
              <button
                onClick={toggleChat}
                className="rounded p-1 text-[#A1A1AA] hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" aria-live="polite" aria-relevant="additions">
              {messages.length === 0 && !isLoading && (
                <motion.p
                  variants={prefersReducedMotion ? undefined : fadeIn}
                  {...(prefersReducedMotion ? {} : { initial: 'hidden', animate: 'visible' })}
                  className="text-center text-sm text-[#A1A1AA] mt-8"
                >
                  Ask me anything about Ashutosh&apos;s experience, skills, or projects.
                </motion.p>
              )}

              {messages.map((msg, index) => (
                <div
                  key={`${msg.timestamp}-${index}`}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-white text-black'
                        : 'bg-[#111113] text-[#A1A1AA] border border-[#27272A]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-[#111113] border border-[#27272A] px-3 py-2">
                    <div className="flex items-center gap-1" aria-label="Loading response">
                      <span className="h-2 w-2 rounded-full bg-[#A1A1AA] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-[#A1A1AA] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-[#A1A1AA] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Error display */}
            {error && (
              <div className="mx-4 mb-2 rounded-md bg-red-900/30 border border-red-800/50 px-3 py-2 text-xs text-red-300" role="alert">
                {error}
              </div>
            )}

            {/* Validation error */}
            {validationError && (
              <div className="mx-4 mb-2 rounded-md bg-yellow-900/30 border border-yellow-800/50 px-3 py-2 text-xs text-yellow-300" role="alert">
                {validationError}
              </div>
            )}

            {/* Input area */}
            <form onSubmit={handleSubmit} className="border-t border-[#27272A] p-3">
              <div className="flex gap-2">
                <label htmlFor="ai-chat-input" className="sr-only">
                  Ask a question about Ashutosh
                </label>
                <input
                  ref={inputRef}
                  id="ai-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setValidationError(null);
                    setError(null);
                  }}
                  placeholder="Ask about experience, skills..."
                  className="flex-1 rounded-lg border border-[#27272A] bg-[#111113] px-3 py-2 text-sm text-white placeholder-[#A1A1AA] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  disabled={isLoading}
                  maxLength={500}
                  aria-describedby={validationError ? 'chat-validation-error' : undefined}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-[#09090B] transition-colors"
                  aria-label="Send message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-xs text-[#A1A1AA]">
                {input.length}/500 characters
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
