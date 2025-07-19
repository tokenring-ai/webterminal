import React from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import Terminal from './Terminal'; // Keep for now, though ChatInstance will render it
import FileViewer from './FileViewer';
import ChatInstance from './ChatInstance';

/**
 * @param {{
 *   tabs: Array<{id: string, title: string, type: string, chatId?: string, filePath?: string}>,
 *   activeTabId: string|null,
 *   onSelect: (id: string) => void,
 *   onClose: (id: string) => void
 *   handleNewChat: () => void
 * }} props
 */
export default function MainPanel({ tabs, activeTabId, onSelect, onClose, handleNewChat }) {
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0] || null;

  return (
    <div className="flex-1 flex flex-col">
      {/* Tab Bar */}
      <div className="flex bg-zinc-200 dark:bg-zinc-700 border-b border-zinc-300 dark:border-zinc-600">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={clsx(
              'flex items-center px-3 py-1 cursor-pointer select-none space-x-1',
              activeTabId === tab.id ? 'bg-white dark:bg-zinc-800 border-t border-zinc-400' : 'hover:bg-zinc-100 dark:hover:bg-zinc-600'
            )}
          >
            <span className="text-sm truncate">{tab.title}</span>
            <X size={12} className="hover:opacity-80" onClick={(e) => { e.stopPropagation(); onClose(tab.id); }} />
          </div>
        ))}
       {/* Add New Chat button, e.g., in TopBar or here for testing */}
       <div className="p-1 bg-zinc-200 dark:bg-zinc-700 flex-shrink-0">
        <button
         onClick={handleNewChat}
         className="ml-1.5 px-2 py-0.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
         +
        </button>
       </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab && activeTab.type === 'chat' && <ChatInstance configService={activeTab.configService} isActive={true} />}
        {activeTab && activeTab.type === 'file' && <FileViewer filePath={activeTab.filePath} />}
        {!activeTab && <div className="p-4 text-zinc-500">No tabs open</div>}
      </div>
    </div>
  );
}