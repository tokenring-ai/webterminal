import type Agent from "@tokenring-ai/agent/Agent";
import { useCallback, useEffect, useReducer, useState } from "react";

const initialMessages = [{ kind: "system", text: "Welcome to WebTerminal!" }];

type Chunk = { kind: string; text: string };

const agentChunks = new Map<Agent, Chunk[]>();
const agentHistories = new Map<Agent, string[]>();
const agentHistoryIndexes = new Map<Agent, number>();
const agentListeners = new Map<Agent, AbortController>();

export function useRepl(agent: Agent | null) {
	const [, forceUpdate] = useState({});

	if (agent && !agentChunks.has(agent)) {
		agentChunks.set(agent, [...initialMessages]);
		agentHistories.set(agent, []);
		agentHistoryIndexes.set(agent, -1);
	}

	useEffect(() => {
		forceUpdate({});
	}, [agent]);

	const chunks = agent ? agentChunks.get(agent) || [] : [];
	const commandHistory = agent ? agentHistories.get(agent) || [] : [];
	const historyIndex = agent ? agentHistoryIndexes.get(agent) || -1 : -1;

	const addChunk = useCallback(
		(chunk: Chunk) => {
			if (!agent) return;
			const currentChunks = agentChunks.get(agent) || [];
			if (chunk.kind === "stdout") {
				const lastMessage = currentChunks[currentChunks.length - 1];
				if (lastMessage && lastMessage.kind === "stdout") {
					agentChunks.set(agent, [
						...currentChunks.slice(0, -1),
						{ kind: "stdout", text: lastMessage.text + chunk.text },
					]);
					forceUpdate({});
					return;
				}
			}
			agentChunks.set(agent, [...currentChunks, chunk]);
			forceUpdate({});
		},
		[agent],
	);

	useEffect(() => {
		if (!agent || agentListeners.has(agent)) return;

		const abortController = new AbortController();
		agentListeners.set(agent, abortController);

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

		return () => {};
	}, [agent, addChunk]);

	const handleInput = useCallback(
		async (line: string) => {
			if (!agent) return;

			const processedInput = (line ?? "").trim();
			if (!processedInput) return;

			const currentHistory = agentHistories.get(agent) || [];
			if (
				processedInput &&
				(currentHistory.length === 0 ||
					currentHistory[currentHistory.length - 1] !== processedInput)
			) {
				agentHistories.set(agent, [...currentHistory, processedInput]);
			}
			agentHistoryIndexes.set(agent, -1);

			agent.handleInput({ message: processedInput });
		},
		[agent],
	);

	const getPreviousCommand = useCallback(() => {
		if (!agent) return "";
		const currentHistory = agentHistories.get(agent) || [];
		const currentIndex = agentHistoryIndexes.get(agent) || -1;
		if (currentHistory.length === 0) return "";
		const newIndex =
			currentIndex === -1
				? currentHistory.length - 1
				: Math.max(0, currentIndex - 1);
		agentHistoryIndexes.set(agent, newIndex);
		return currentHistory[newIndex];
	}, [agent]);

	const getNextCommand = useCallback(() => {
		if (!agent) return "";
		const currentHistory = agentHistories.get(agent) || [];
		const currentIndex = agentHistoryIndexes.get(agent) || -1;
		if (currentIndex === -1 || currentIndex >= currentHistory.length - 1) {
			agentHistoryIndexes.set(agent, -1);
			return "";
		}
		const newIndex = Math.min(currentHistory.length - 1, currentIndex + 1);
		agentHistoryIndexes.set(agent, newIndex);
		return currentHistory[newIndex];
	}, [agent]);

	return {
		chunks,
		handleInput,
		getPreviousCommand,
		getNextCommand,
		historyIndex,
	};
}
