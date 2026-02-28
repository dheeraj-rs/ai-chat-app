import { Send, Loader2, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 128);
      textareaRef.current.style.height = newHeight + 'px';
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className={`flex items-end gap-2 rounded-2xl border-2 transition-all ${
          isFocused
            ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
        }`}>
          <button
            type="button"
            className="m-2 p-2.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-white transition-colors"
            aria-label="Add attachment"
          >
            <Plus size={20} />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Send a message..."
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent px-2 py-3 outline-none resize-none max-h-32 disabled:opacity-50 text-gray-900 placeholder-gray-500"
            aria-label="Message input"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`m-2 p-2.5 rounded-lg transition-all ${
              !input.trim() || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
            }`}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        {isFocused && (
          <p className="text-xs text-gray-500 text-center mt-2 animate-fade-in">
            Press Enter to send, Shift + Enter for new line
          </p>
        )}
      </form>
    </div>
  );
}
