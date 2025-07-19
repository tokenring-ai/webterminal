import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRegistry } from "../context/RegistryProvider";
import { useRepl } from "../hooks/useRepl";

/**
 * @returns {JSX.Element}
 */
function Terminal() {
	const registry = useRegistry();

	// Added historyIndex
	const {
		chunks,
		handleInput,
		getPreviousCommand,
		getNextCommand,
		historyIndex,
	} = useRepl(registry);

	const [input, setInput] = useState("");
	const [currentInputValueBeforeHistory, setCurrentInputValueBeforeHistory] =
		useState(""); // Store input before navigating history
	const containerRef = useRef(null);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [chunks]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;

		await handleInput(input);
		setInput("");
		setCurrentInputValueBeforeHistory(""); // Clear saved input on submit
	};

	const handleKeyDown = (e) => {
		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (historyIndex === -1) {
				// If on the current input line (not browsing history yet)
				setCurrentInputValueBeforeHistory(input);
			}
			const prevCommand = getPreviousCommand();
			setInput(prevCommand); // If history is empty, prevCommand is '', input becomes currentInputValueBeforeHistory via ArrowDown later or stays empty.
			// If at start of history, prevCommand is the first item.
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			const nextCommand = getNextCommand();
			// historyIndex becomes -1 when we navigate past the last item towards "new input"
			if (historyIndex === -1 && nextCommand === "") {
				// Correctly check if we should restore the original input
				setInput(currentInputValueBeforeHistory);
				setCurrentInputValueBeforeHistory(""); // Clear after restoring
			} else {
				setInput(nextCommand); // Either a command from history or '' if navigating from empty history
			}
		}
		// Add any other key handling logic here if needed
	};

	const typeToColor = {
		system: "text-blue-400",
		error: "text-red-400",
		warning: "text-yellow-300",
		stdout: "text-green-400",
		user: "text-white",
	};

	return (
		<div className="flex-1 flex flex-col bg-black text-green-400 font-mono overflow-scroll h-full">
			<div
				ref={containerRef}
				className="flex-1 overflow-y-auto p-2 space-y-1 text-sm scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-green-600 hover:scrollbar-thumb-green-500"
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "#16a34a #1f2937",
				}}
			>
				{chunks.map((l, i) => (
					<motion.div
						key={i}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className={typeToColor[l.kind] || ""}
					>
						{l.text}
					</motion.div>
				))}
			</div>
			<form onSubmit={handleSubmit} className="border-t border-green-700 p-2">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					className="w-full bg-transparent outline-none border-none text-green-400 placeholder-green-700"
					placeholder="Type a command..."
				/>
			</form>
		</div>
	);
}

export default Terminal;
