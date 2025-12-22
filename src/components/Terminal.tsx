import React, { useEffect, useRef, useState } from "react";
import {useAgentManager} from "../context/TokenRingAppProvider.js";
import { useRepl } from "../hooks/useRepl.js";

type TerminalTab = {
	id: string;
	title: string;
	agentId: string;
};

type TerminalProps = {
	height: number;
	onResize: (height: number | ((prev: number) => number)) => void;
	terminalTabs: TerminalTab[];
	activeTerminalId: string | null;
	onSelectTerminal: (id: string) => void;
	onCloseTerminal: (id: string) => void;
	onNewAgent: () => void;
};

function Terminal({
	height,
	onResize,
	terminalTabs,
	activeTerminalId,
	onSelectTerminal,
	onCloseTerminal,
	onNewAgent,
}: TerminalProps) {
	const agentManager = useAgentManager();
	const activeTab = terminalTabs.find((t) => t.id === activeTerminalId);
	const activeAgent =
		activeTab && agentManager ? agentManager.getAgent(activeTab.agentId) : null;
	const {
		chunks,
		handleInput,
		getPreviousCommand,
		getNextCommand,
		historyIndex,
	} = useRepl(activeAgent ?? null);

	const [input, setInput] = useState("");
	const [currentInputValueBeforeHistory, setCurrentInputValueBeforeHistory] =
		useState("");
	const containerRef = useRef<HTMLDivElement>(null);
	const resizeRef = useRef<number | null>(null);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [chunks]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;
		await handleInput(input);
		setInput("");
		setCurrentInputValueBeforeHistory("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (historyIndex === -1) {
				setCurrentInputValueBeforeHistory(input);
			}
			const prevCommand = getPreviousCommand();
			setInput(prevCommand);
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			const nextCommand = getNextCommand();
			if (historyIndex === -1 && nextCommand === "") {
				setInput(currentInputValueBeforeHistory);
				setCurrentInputValueBeforeHistory("");
			} else {
				setInput(nextCommand);
			}
		}
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		resizeRef.current = e.clientY;
		const handleMove = (ev: MouseEvent) => {
			if (resizeRef.current === null) return;
			const delta = resizeRef.current - ev.clientY;
			onResize((h: number) =>
				Math.min(window.innerHeight - 200, Math.max(100, h + delta)),
			);
			resizeRef.current = ev.clientY;
		};
		const stop = () => {
			window.removeEventListener("mousemove", handleMove);
			window.removeEventListener("mouseup", stop);
		};
		window.addEventListener("mousemove", handleMove);
		window.addEventListener("mouseup", stop);
	};

	const typeToColor: Record<string, string> = {
		system: "text-cyan-400",
		error: "text-red-400",
		warning: "text-yellow-400",
		stdout: "text-green-400",
		user: "text-white",
	};



	return (
		<div
			className="bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 flex flex-col"
			style={{ height: `${height}px` }}
		>
			<div
				onMouseDown={handleMouseDown}
				className="flex items-center justify-between px-2 py-0 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 cursor-ns-resize"
			>
				<div className="flex items-center space-x-0">
					{terminalTabs.map((tab) => (
						<div
							key={tab.id}
							className={`px-4 py-1.5 text-sm transition-colors flex items-center space-x-2 border-r border-gray-300 dark:border-gray-700 ${
								activeTerminalId === tab.id
									? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium"
									: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-750"
							}`}
						>
							<span onClick={() => onSelectTerminal(tab.id)} className="cursor-pointer">{tab.title}</span>
							<button
								onClick={() => onCloseTerminal(tab.id)}
								className="ml-1 hover:text-red-500 text-gray-500 dark:text-gray-500"
							>
								×
							</button>
						</div>
					))}
					<button
						onClick={onNewAgent}
						className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
					>
						+
					</button>
				</div>
			</div>
			<div
				ref={containerRef}
				className="flex-1 overflow-y-auto p-4 font-mono text-sm flex flex-col justify-end"
			>
				<div>
					{chunks.map((l, i: number) => (
						<div
							key={i}
							className={`mb-2 whitespace-pre-wrap ${typeToColor[l.type] || "text-gray-700 dark:text-gray-300"}`}
						>
							{l.message}
						</div>
					))}
				</div>
			</div>
			<form
				onSubmit={handleSubmit}
				className="border-t border-gray-300 dark:border-gray-700 p-2 flex items-center"
			>
				<span className="text-green-600 dark:text-green-400 mr-2">$</span>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					className="flex-1 bg-transparent text-gray-900 dark:text-white outline-none"
					placeholder="Type a command..."
				/>
				<button
					type="submit"
					className="ml-2 p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
				>
					<svg
						className="w-5 h-5 text-gray-600 dark:text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M13 5l7 7-7 7M5 5l7 7-7 7"
						/>
					</svg>
				</button>
			</form>
		</div>
	);
}

export default Terminal;
