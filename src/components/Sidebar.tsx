import clsx from "clsx";
import React from "react";

type SidebarProps = {
	activeView: string;
	onViewChange: (view: string) => void;
};

function Sidebar({ activeView, onViewChange }: SidebarProps) {
	return (
		<div className="w-16 bg-gray-200 dark:bg-gray-800 flex flex-col items-center py-4 space-y-6">
			<button
				onClick={() => onViewChange("chats")}
				className={clsx(
					"p-3 rounded-lg transition-all duration-200 group relative",
					activeView === "chats"
						? "bg-gray-300 dark:bg-gray-700 text-purple-600 dark:text-purple-400"
						: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700",
				)}
			>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
					/>
				</svg>
				<span className="absolute left-full ml-2 px-2 py-1 bg-gray-700 dark:bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
					Recent Chats
				</span>
			</button>
			<button
				onClick={() => onViewChange("files")}
				className={clsx(
					"p-3 rounded-lg transition-all duration-200 group relative",
					activeView === "files"
						? "bg-gray-300 dark:bg-gray-700 text-purple-600 dark:text-purple-400"
						: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700",
				)}
			>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
					/>
				</svg>
				<span className="absolute left-full ml-2 px-2 py-1 bg-gray-700 dark:bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
					File Explorer
				</span>
			</button>
			<button
				onClick={() => onViewChange("settings")}
				className={clsx(
					"p-3 rounded-lg transition-all duration-200 group relative",
					activeView === "settings"
						? "bg-gray-300 dark:bg-gray-700 text-purple-600 dark:text-purple-400"
						: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700",
				)}
			>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
				<span className="absolute left-full ml-2 px-2 py-1 bg-gray-700 dark:bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
					Settings
				</span>
			</button>
		</div>
	);
}

export default Sidebar;
