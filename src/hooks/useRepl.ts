import type Agent from "@tokenring-ai/agent/Agent";
import { useCallback, useEffect, useReducer, useState } from "react";

const initialMessages = [{ kind: "system", text: "Welcome to WebTerminal!" }];

export function useRepl(agent: Agent | null) {
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);

	type Chunk = { kind: string; text: string };

	const [chunks, addChunk] = useReducer((prevState: Chunk[], chunk: Chunk) => {
		if (chunk.kind === "stdout") {
			const lastMessage = prevState?.[prevState.length - 1];
			if (lastMessage && lastMessage.kind === "stdout") {
				return [
					...prevState.slice(0, -1),
					{ kind: "stdout", text: lastMessage.text + chunk.text },
				];
			}
		}
		return [...prevState, chunk];
	}, initialMessages);

	useEffect(() => {
		if (!agent) return;

		const abortController = new AbortController();

		(async () => {
			for await (const event of agent.events(abortController.signal)) {
				switch (event.type) {
					case "output.chat":
						addChunk({ kind: "stdout", text: event.data.content });
						break;
					case "output.reasoning":
						addChunk({ kind: "system", text: event.data.content });
						break;
					case "output.system":
						addChunk({
							kind: event.data.level || "system",
							text: event.data.message,
						});
						break;
					case "input.received":
						addChunk({ kind: "user", text: `> ${event.data.message}` });
						break;
				}
			}
		})();

		return () => abortController.abort();
	}, [agent]);

	const handleInput = useCallback(
		async (line: string) => {
			if (!agent) return;

			const processedInput = (line ?? "").trim();
			if (!processedInput) return;

			if (
				processedInput &&
				(commandHistory.length === 0 ||
					commandHistory[commandHistory.length - 1] !== processedInput)
			) {
				setCommandHistory((prev: string[]) => [...prev, processedInput]);
			}
			setHistoryIndex(-1);

			agent.handleInput({ message: processedInput });
		},
		[agent, commandHistory],
	);

	const getPreviousCommand = useCallback(() => {
		if (commandHistory.length === 0) return "";
		const newIndex =
			historyIndex === -1
				? commandHistory.length - 1
				: Math.max(0, historyIndex - 1);
		setHistoryIndex(newIndex);
		return commandHistory[newIndex];
	}, [commandHistory, historyIndex]);

	const getNextCommand = useCallback(() => {
		if (historyIndex === -1 || historyIndex >= commandHistory.length - 1) {
			setHistoryIndex(-1);
			return "";
		}
		const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
		setHistoryIndex(newIndex);
		return commandHistory[newIndex];
	}, [commandHistory, historyIndex]);

	return {
		chunks,
		handleInput,
		getPreviousCommand,
		getNextCommand,
		historyIndex,
	};
}
