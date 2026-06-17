import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import ChatBubble, { TypingIndicator } from '../components/ui/ChatBubble';
import MessageInput from '../components/ui/MessageInput';
import { useApi } from '../hooks/useApi';
import { sendChatMessage } from '../services/api';
import type { ChatMessage } from '../types';

const suggestedQuestions = [
  'What should I eat before a workout?',
  'How can I improve my sleep quality?',
  'Create a beginner workout plan',
  'How much protein do I need daily?',
  'Tips for muscle recovery after gym',
  'Best exercises for fat loss',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { isLoading, execute } = useApi(sendChatMessage);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSend = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const response = await execute({ message });
    if (response) {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] max-w-3xl mx-auto">
      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-5 pb-4 pr-1">
        {/* Empty State */}
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-center px-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent-purple/15 flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-accent-purple" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">AI Fitness Coach</h2>
            <p className="text-sm text-text-muted max-w-sm mb-8">
              Ask me anything about fitness, nutrition, workouts, or recovery. I&apos;m here to help you reach your goals.
            </p>

            {/* Suggested Questions */}
            <div className="w-full max-w-md">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Suggested Questions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedQuestions.map((q) => (
                  <motion.button
                    key={q}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend(q)}
                    className="text-left px-4 py-3 rounded-xl bg-bg-secondary border border-border hover:border-border-hover text-sm text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Typing Indicator */}
        {isLoading && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-border">
        <MessageInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
