import type Agent from "@tokenring-ai/agent/Agent";
import React, {useEffect, useState} from "react";
import {useAgentTeam} from "../context/AgentTeamProvider.tsx";

type Message = {
	type: "user" | "assistant" | "system";
	content: string;
};

const ChatInstance = ({ agentId, isActive }: { agentId: string; isActive: boolean }) => {
	const team = useAgentTeam();
	const [agent, setAgent] = useState<Agent | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");

	useEffect(() => {
		if (!team || !agentId) return;

		let currentAgent: Agent | null = null;

		const initAgent = async () => {
			currentAgent = await team.createAgent("interactiveCodeAgent");
			setAgent(currentAgent);
		};

		initAgent();

		return () => {
			if (currentAgent) {
				team.deleteAgent(currentAgent);
			}
		};
	}, [team, agentId]);

	useEffect(() => {
		if (!agent || !isActive) return;

		const abortController = new AbortController();
		
		(async () => {
			for await (const event of agent.events(abortController.signal)) {
				switch (event.type) {
					case "output.chat":
						setMessages(prev => [...prev, { type: "assistant", content: event.data.content }]);
						break;
					case "output.system":
						setMessages(prev => [...prev, { type: "system", content: event.data.message }]);
						break;
					case "input.received":
						setMessages(prev => [...prev, { type: "user", content: event.data.message }]);
						break;
				}
			}
		})();

		return () => abortController.abort();
	}, [agent, isActive]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!agent || !input.trim()) return;
		agent.handleInput({ message: input });
		setInput("");
	};

	if (!isActive) return null;

	return (
		<div className="h-full flex flex-col bg-gray-900">
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((msg, i) => (
					<div key={i} className={`${msg.type === "user" ? "text-blue-400" : msg.type === "system" ? "text-gray-400" : "text-white"}`}>
						{msg.content}
					</div>
				))}
			</div>
			<form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg outline-none"
					placeholder="Type a message..."
				/>
			</form>
		</div>
	);
};

export default ChatInstance;
