import React from "react";
import ChatInstance from "./ChatInstance.tsx";
import FileViewer from "./FileViewer.tsx";

type Tab = {
	id: string;
	title?: string;
	type: string;
	agentId?: string;
	filePath?: string;
};

type MainPanelProps = {
	tabs: Tab[];
	activeTabId: string | null;
	onSelect: (id: string) => void;
	onClose: (id: string) => void;
	handleNewChat: () => void;
};

export default function MainPanel({
	tabs,
	activeTabId,
	onSelect,
	onClose,
	handleNewChat,
}: MainPanelProps) {
	const activeTab = tabs.find((t: Tab) => t.id === activeTabId) || tabs[0] || null;

	return (
		<div className="flex-1 flex flex-col bg-gray-900">
			<div className="flex-1 overflow-hidden">
				{activeTab && activeTab.type === "chat" && (
					<ChatInstance
						agentId={activeTab.agentId!}
						isActive={true}
					/>
				)}
				{activeTab && activeTab.type === "file" && activeTab.filePath && (
					<FileViewer filePath={activeTab.filePath} onFileDeleted={() => onClose(activeTab.id)} onFileRenamed={(newPath: string) => {}} />
				)}
				{!activeTab && (
					<div className="flex items-center justify-center h-full">
						<div className="text-center">
							<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
								<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>
							<h2 className="text-xl font-semibold text-white mb-2">Welcome to WebTerminal</h2>
							<p className="text-gray-400 mb-4">Start a new chat or open a file to begin</p>
							<button
								onClick={handleNewChat}
								className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
							>
								New Chat
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
