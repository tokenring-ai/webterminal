
import React from 'react'; // Removed useEffect, useState, useCallback, useRegistry
import { MessageSquare, PlusCircle } from 'lucide-react';
// Removed ChatService and ChatHistoryService imports as they are no longer used directly here.

/**
 * Displays a list of currently open chat tabs and a button to create a new chat.
 *
 * @param {{
 *   chatTabs: Array<{id: string, title: string, type: string}>, // List of active chat tabs
 *   onNewChat: () => void, // Callback to create a new chat (triggers App.jsx's handleNewChat)
 *   onSelectChatTab: (id: string, title: string) => void // Callback to select an existing tab (triggers App.jsx's selectTab)
 * }} props
 */
export default function ChatList({ chatTabs, onNewChat, onSelectChatTab }) {
  // No longer loads chats from a service; displays tabs passed as props.
  // No longer creates new chats directly; calls onNewChat prop.
  // Error state is removed as operations that caused errors are removed.

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onNewChat} // Use the onNewChat prop from App.jsx
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                     bg-blue-500 hover:bg-blue-600 text-white
                     dark:bg-blue-600 dark:hover:bg-blue-700
                     transition-colors"
        >
          <PlusCircle size={18} className="shrink-0" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 p-2 overflow-auto space-y-1">
        {(!chatTabs || chatTabs.length === 0) && (
          <div className="p-3 text-sm text-center text-gray-500 dark:text-gray-400">
            No active chats. <br /> Click "New Chat" to start.
          </div>
        )}
        {chatTabs && chatTabs.map(chatTab => {
          // Ensure we use properties available on the chatTab object.
          // App.jsx creates tabs with 'id' and 'title'.
          const { id, title } = chatTab;
          return (
            <button
              key={id}
              // When a chat tab in the list is clicked, call onSelectChatTab
              // (which is App.jsx's selectTab via Sidebar's onChatSelect prop).
              onClick={() => onSelectChatTab(id, title)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
                         hover:bg-gray-100 dark:hover:bg-gray-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         transition-colors group" // Added group for potential future hover effects on children
            >
              <MessageSquare size={16} className="shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
              <div className="flex-1 text-left truncate text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">
                {title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
