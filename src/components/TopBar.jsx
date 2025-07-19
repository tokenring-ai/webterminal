import React, { useRef } from "react";
import { motion } from "framer-motion";
import useSession from "../hooks/useSession";

/**
 * @typedef {Object} Props
 * @property {() => void} onMaximize
 * @property {boolean} isMaximized
 * @property {(deltaY:number)=>void} onResize
 */

/**
 * @param {Props} props
 */
function TopBar({ onMaximize, isMaximized, onResize }) {
	const { data: session, loading, signIn, signOut } = useSession();
	const startRef = useRef(null);

	const handleMouseDown = (e) => {
		startRef.current = e.clientY;
		const handleMove = (ev) => {
			const delta = ev.clientY - startRef.current;
			onResize(delta);
			startRef.current = ev.clientY;
		};
		const stop = () => {
			window.removeEventListener("mousemove", handleMove);
			window.removeEventListener("mouseup", stop);
		};
		window.addEventListener("mousemove", handleMove);
		window.addEventListener("mouseup", stop);
	};

	return (
		<motion.div
			className="flex items-center justify-end gap-2 px-2 py-1 bg-zinc-200 dark:bg-zinc-700 cursor-ns-resize select-none"
			onMouseDown={handleMouseDown}
		>
			{/* Auth controls */}
			{loading ? (
				<span className="px-2 py-1 text-xs text-gray-500">Loading...</span>
			) : session ? (
				<>
					<span
						className="px-2 py-1 text-xs text-gray-800 dark:text-gray-200"
						title={session.user?.email}
					>
						{session.user?.name || session.user?.email}
					</span>
					<button
						onClick={signOut}
						className="px-2 py-1 text-xs"
						title="Sign out"
					>
						Sign out
					</button>
				</>
			) : (
				<button onClick={signIn} className="px-2 py-1 text-xs" title="Sign in">
					Sign in
				</button>
			)}
			<button
				className="w-3 h-3 rounded-full bg-yellow-400 hover:opacity-80"
				onClick={onMaximize}
				title={isMaximized ? "Restore" : "Maximize"}
			/>
			<button
				className="w-3 h-3 rounded-full bg-red-500 hover:opacity-80"
				title="Close (not implemented)"
			/>
		</motion.div>
	);
}

export default TopBar;
