import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';

  const formatContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('•')) {
        return (
          <li key={idx} className="ml-4 text-gray-700">
            {line.replace('•', '').trim()}
          </li>
        );
      }
      return (
        <p key={idx} className="text-gray-700 leading-relaxed">
          {line || '\u00A0'}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 px-4 py-4 sm:px-6 sm:py-5 ${isUser ? 'bg-white' : 'bg-gray-50'}`}>
      <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center flex-none ${
        isUser ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-gray-800 to-gray-900'
      } shadow-sm`}>
        {isUser ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-semibold text-sm text-gray-900">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-gray-500">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="space-y-1 text-sm">
          {typeof content === 'string' && content.includes('\n') && content.includes('•') ? (
            <div>
              {formatContent(content)}
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
