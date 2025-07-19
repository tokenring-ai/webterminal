import React, { useState } from 'react';
import clsx from 'clsx';
import ChatList from './ChatList';
import FileTree from './FileTree';
import SettingsPanel from './SettingsPanel';

const tabs = [
  { id: 'chats', label: 'Chats' },
  { id: 'files', label: 'Files' },
  { id: 'settings', label: 'Settings' },
];

/**
 * @param {{
 *   onChatSelect: (id: string, title: string) => void, // Should become onSelectTab(id: string)
 *   onFileOpen: (filePath: string) => void,
 *   chatTabs: Array<{id: string, title: string, type: string}>,
 *   onNewChat: () => void
 * }} props
 */
function Sidebar({ onChatSelect, onFileOpen, chatTabs, onNewChat }) {
  const [activeTab, setActiveTab] = useState('chats');
  // Note: onChatSelect is now more like App.jsx's selectTab,
  // which is used to switch to an existing tab.
  // ChatList will need this to open a tab when a chat from its list is clicked.

  return (
    <div className="w-96 flex flex-col bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700">
      <div className="flex">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={clsx(
              'flex-1 py-2 text-sm',
              activeTab === t.id ? 'bg-zinc-200 dark:bg-zinc-700' : ''
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
         {activeTab === 'chats' && (
           <ChatList
             chatTabs={chatTabs}
             onNewChat={onNewChat}
             onSelectChatTab={onChatSelect} // Pass App.jsx's selectTab (via onChatSelect prop)
           />
         )}
        {activeTab === 'files' && <FileTree onFileOpen={onFileOpen} />}
        {activeTab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  );
}

export default Sidebar;