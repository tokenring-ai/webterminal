import React from "react";
import useSession from "../hooks/useSession.js";

function TopBar() {
	const { data: session, loading, signIn, signOut } = useSession() as any;

	return (
		<nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
			<div className="flex items-center space-x-3">
				<div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
					<svg
						className="w-5 h-5 text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<h1 className="text-xl font-semibold text-white">WebTerminal</h1>
			</div>
			<div className="flex items-center space-x-4">
				<button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
					<svg
						className="w-5 h-5 text-gray-300"
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
				</button>
				<button className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors">
					<svg
						className="w-5 h-5 text-gray-300"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
						/>
					</svg>
					<span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
				</button>
				{loading ? (
					<span className="text-sm text-gray-300">Loading...</span>
				) : session ? (
					<button
						onClick={signOut}
						className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
					>
						<div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600" />
						<span className="text-sm text-gray-300">
							{session.user?.name || "User"}
						</span>
					</button>
				) : (
					<button
						onClick={signIn}
						className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
					>
						<div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600" />
						<span className="text-sm text-gray-300">Sign In</span>
					</button>
				)}
			</div>
		</nav>
	);
}

export default TopBar;
