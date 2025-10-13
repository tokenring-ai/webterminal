import { Moon, Sun } from "lucide-react";
import React, { useState } from "react";
import { useTheme } from "../context/ThemeProvider.tsx";
import useSession from "../hooks/useSession.js";
import SignInDialog from "./SignInDialog.tsx";
import NotificationDropdown from "./NotificationDropdown.tsx";

function TopBar() {
	const { theme, setTheme } = useTheme();
	const { data: session, loading, signOut } = useSession() as any;
	const [showSignIn, setShowSignIn] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [notifications, setNotifications] = useState([
		{ id: "1", message: "Agent completed task successfully", time: "2 min ago", read: false },
		{ id: "2", message: "New file created: app.tsx", time: "5 min ago", read: false },
		{ id: "3", message: "Build completed", time: "10 min ago", read: true },
	]);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const handleMarkRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
		);
	};

	const handleClearAll = () => {
		setNotifications([]);
		setShowNotifications(false);
	};

	return (
		<nav className="bg-linear-to-r from-gray-900 to-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
			<div className="flex items-center space-x-3">
				<div className="w-8 h-8 bg-linear-to-br from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
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
				<button
					onClick={() => setTheme(theme === "light" ? "dark" : "light")}
					className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
					title="Toggle theme"
				>
					{theme === "light" ? (
						<Moon className="w-5 h-5 text-gray-300" />
					) : (
						<Sun className="w-5 h-5 text-yellow-400" />
					)}
				</button>
				<div className="relative">
					<button
						onClick={() => setShowNotifications(!showNotifications)}
						className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors"
					>
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
						{unreadCount > 0 && (
							<span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
						)}
					</button>
					{showNotifications && (
						<NotificationDropdown
							notifications={notifications}
							onClose={() => setShowNotifications(false)}
							onMarkRead={handleMarkRead}
							onClearAll={handleClearAll}
						/>
					)}
				</div>
				{loading ? (
					<span className="text-sm text-gray-300">Loading...</span>
				) : session ? (
					<button
						onClick={signOut}
						className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
					>
						<div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-500 to-indigo-600" />
						<span className="text-sm text-gray-300">
							{session.user?.name || "User"}
						</span>
					</button>
				) : (
					<button
						onClick={() => setShowSignIn(true)}
						className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
					>
						<div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-500 to-indigo-600" />
						<span className="text-sm text-gray-300">Sign In</span>
					</button>
				)}
			</div>
			{showSignIn && <SignInDialog onClose={() => setShowSignIn(false)} />}
		</nav>
	);
}

export default TopBar;
