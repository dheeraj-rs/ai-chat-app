import { Plus, MessageSquare, Menu, X, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat?: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isOpen,
  onToggle
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Plus size={20} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {chats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onMouseEnter={() => setHoveredId(chat.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative"
                >
                  <button
                    onClick={() => {
                      onSelectChat(chat.id);
                      if (window.innerWidth < 1024) onToggle();
                    }}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-colors duration-200 ${
                      currentChatId === chat.id
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MessageSquare size={16} className="mt-1 flex-shrink-0 opacity-75" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{chat.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(chat.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                  {hoveredId === chat.id && onDeleteChat && (
                    <button
                      onClick={() => onDeleteChat(chat.id)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Delete chat"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900 bg-opacity-50">
          <div className="text-xs text-gray-400">
            <p className="font-semibold text-gray-300 mb-1">AI Chat Assistant</p>
            <p className="text-gray-500">Version 1.0</p>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
    </>
  );
}
