import React from "react"; // Removed useEffect, useState, useCallback, useRegistry
// Removed ChatService and ChatHistoryService imports as they are no longer used directly here.

type ChatTab = {
	id: string;
	title: string;
	type: string;
};

type ChatListProps = {
	chatTabs: ChatTab[];
	onNewChat: () => void;
	onSelectChatTab: (id: string, title: string) => void;
};

export default function ChatList({
	chatTabs,
	onNewChat,
	onSelectChatTab,
}: ChatListProps) {
	// No longer loads chats from a service; displays tabs passed as props.
	// No longer creates new chats directly; calls onNewChat prop.
	// Error state is removed as operations that caused errors are removed.

	return (
		<>
			<h2 className="text-gray-400 text-sm font-semibold mb-4 px-2">
				RECENT AGENTS
			</h2>
			<div className="space-y-2">
				{chatTabs &&
					chatTabs.map((chatTab: ChatTab) => {
						const { id, title } = chatTab;
						return (
							<button
								key={id}
								onClick={() => onSelectChatTab(id, title)}
								className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors group"
							>
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
										<span className="text-white text-xs font-bold">AI</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-white truncate">
											{title}
										</p>
										<p className="text-xs text-gray-400 truncate">
											Active agent session
										</p>
									</div>
								</div>
							</button>
						);
					})}
			</div>
			<button
				onClick={onNewChat}
				className="mt-6 w-full py-3 px-4 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 transition-colors flex items-center justify-center space-x-2"
			>
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				<span>New Agent</span>
			</button>
		</>
	);
}
