import type Agent from "@tokenring-ai/agent/Agent";
import { AgentEventState } from "@tokenring-ai/agent/state/agentEventState";
import { useCallback, useEffect, useState } from "react";

const initialMessages = [{ kind: "system", text: "Welcome to WebTerminal!" }];

type Chunk = { kind: string; text: string };

const agentHistories = new Map<Agent, string[]>();
const agentHistoryIndexes = new Map<Agent, number>();

export function useRepl(agent: Agent | null) {
	const [chunks, setChunks] = useState<Chunk[]>(initialMessages);

	if (agent && !agentHistories.has(agent)) {
		agentHistories.set(agent, []);
		agentHistoryIndexes.set(agent, -1);
	}

	const commandHistory = agent ? agentHistories.get(agent) || [] : [];
	const historyIndex = agent ? agentHistoryIndexes.get(agent) || -1 : -1;

	useEffect(() => {
		if (!agent) return;

		const unsubscribe = agent.subscribeState(AgentEventState, (state) => {
			const newChunks: Chunk[] = [...initialMessages];
			for (const event of state.events) {
				switch (event.type) {
					case "output.chat":
						newChunks.push({ kind: "stdout", text: event.content });
						break;
					case "output.reasoning":
						newChunks.push({ kind: "system", text: event.content });
						break;
					case "output.system":
						newChunks.push({
							kind: event.level || "system",
							text: event.message,
						});
						break;
					case "input.received":
						newChunks.push({ kind: "user", text: `> ${event.message}` });
						break;
				}
			}
			setChunks(newChunks);
		});

		return () => unsubscribe();
	}, [agent]);

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
