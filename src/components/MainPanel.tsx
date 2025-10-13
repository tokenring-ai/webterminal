import React from "react";
import ChatList from "./ChatList.tsx";
import FileTree from "./FileTree.tsx";
import FileViewer from "./FileViewer.tsx";
import SettingsPanel from "./SettingsPanel.tsx";

type Tab = {
	id: string;
	title: string;
	type: string;
	agentId?: string;
	filePath?: string;
};

type MainPanelProps = {
	activeView: string;
	tabs: Tab[];
	onFileOpen: (filePath: string) => void;
	onFileClose: (id: string) => void;
	onNewChat: () => void;
	onSelectChatTab: (id: string) => void;
};

export default function MainPanel({
	activeView,
	tabs,
	onFileOpen,
	onFileClose,
	onNewChat,
	onSelectChatTab,
}: MainPanelProps) {
	const fileTab = tabs.find((t) => t.type === "file");
	const [treeCollapsed, setTreeCollapsed] = React.useState(false);

	return (
		<div className="h-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
			{activeView === "agents" && (
				<div className="flex-1 overflow-y-auto p-4">
					<ChatList
						chatTabs={tabs.filter((t) => t.type === "chat")}
						onNewChat={onNewChat}
						onSelectChatTab={onSelectChatTab}
					/>
				</div>
			)}
			{activeView === "files" && (
				<div className="flex-1 flex overflow-hidden">
					{!treeCollapsed && (
						<div className="w-64 border-r border-gray-300 dark:border-gray-700 overflow-y-auto p-4">
							<FileTree onFileOpen={onFileOpen} />
						</div>
					)}
					{fileTab && (
						<div className="flex-1 flex flex-col overflow-hidden relative">
							<button
								onClick={() => setTreeCollapsed(!treeCollapsed)}
								className="absolute top-2 left-2 z-10 p-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300"
								title={treeCollapsed ? "Show file tree" : "Hide file tree"}
							>
								{treeCollapsed ? "▶" : "◀"}
							</button>
							<FileViewer
								filePath={fileTab.filePath!}
								onFileDeleted={() => onFileClose(fileTab.id)}
								onFileRenamed={() => {}}
							/>
						</div>
					)}
				</div>
			)}
			{activeView === "settings" && (
				<div className="flex-1 overflow-y-auto">
					<SettingsPanel />
				</div>
			)}
		</div>
	);
}
