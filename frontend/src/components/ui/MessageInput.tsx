import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function MessageInput({
  onSend,
  isLoading = false,
  placeholder = 'Ask beFit AI anything...',
}: MessageInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex items-end gap-2 bg-bg-secondary border border-border rounded-2xl p-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        rows={1}
        className="
          flex-1 bg-transparent text-text-primary text-sm
          placeholder:text-text-muted resize-none
          focus:outline-none
          disabled:opacity-50
          max-h-[150px]
        "
        aria-label="Message input"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        disabled={!value.trim() || isLoading}
        className="
          flex-shrink-0 w-9 h-9 rounded-xl
          bg-primary text-bg-primary
          flex items-center justify-center
          disabled:opacity-30 disabled:cursor-not-allowed
          hover:bg-primary-hover transition-colors cursor-pointer
        "
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
