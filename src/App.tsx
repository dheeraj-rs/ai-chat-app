import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(chat => chat.id === currentChatId);

  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Conversation',
      timestamp: new Date(),
      messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setIsSidebarOpen(false);
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      const remaining = chats.filter(chat => chat.id !== chatId);
      if (remaining.length > 0) {
        setCurrentChatId(remaining[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const updateChatTitle = (chatId: string, firstMessage: string) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '') }
          : chat
      )
    );
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChatId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setChats(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    if (currentChat?.messages.length === 0) {
      updateChatTitle(currentChatId, content);
    }

    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(content),
        timestamp: new Date(),
      };

      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );
      setIsLoading(false);
    }, 1000);
  };

  const getAIResponse = (userMessage: string): string => {
    const responses = [
      `I understand you're asking about "${userMessage}". I'm a demo AI assistant interface, similar to ChatGPT, Claude, or Gemini. This is a beautifully designed chat interface with a modern, clean aesthetic.`,
      `That's an interesting question! This interface demonstrates a production-ready chat UI with features like:\n\n• Clean, modern design\n• Responsive layout for mobile and desktop\n• Chat history in the sidebar\n• Smooth animations and transitions\n• Message bubbles with timestamps\n\nFeel free to explore the interface!`,
      `Great question about "${userMessage}"! This UI includes all the key features you'd expect from a modern AI chat interface. Try creating new chats, switching between conversations, or testing the responsive design by resizing your browser.`,
      `I appreciate your message. This interface showcases a polished, professional design with careful attention to:\n\n• Typography and spacing\n• Color contrast and readability\n• User experience and interaction patterns\n• Mobile-first responsive design\n\nWhat else would you like to know?`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={createNewChat}
        onSelectChat={setCurrentChatId}
        onDeleteChat={deleteChat}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              {currentChat?.title || 'AI Chat Assistant'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Always here to help you
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className="h-full flex items-center justify-center px-4 py-8">
              <div className="max-w-2xl w-full text-center space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5.36-5.364l.707-.707M5.95 5.95l-.707.707m12.728 12.728l-.707-.707M5.95 18.05l-.707.707" />
                    </svg>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    How can I assist you?
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto">
                    Ask me anything, from explaining concepts to brainstorming ideas. I'm here to provide thoughtful, helpful responses.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 pt-4">
                  {[
                    { text: 'Explain a complex topic', icon: '💡' },
                    { text: 'Help brainstorm ideas', icon: '🧠' },
                    { text: 'Write creative content', icon: '✍️' },
                    { text: 'Solve problems step-by-step', icon: '⚙️' },
                  ].map((item) => (
                    <button
                      key={item.text}
                      onClick={() => handleSendMessage(item.text)}
                      className="group p-4 sm:p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/20 transition-all text-left"
                    >
                      <p className="text-lg mb-2 group-hover:scale-110 transition-transform">{item.icon}</p>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{item.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {currentChat.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="flex gap-4 p-6 bg-gray-50">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5Z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">Assistant</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;
