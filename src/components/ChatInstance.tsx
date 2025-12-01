import { HumanInterfaceRequest } from "@tokenring-ai/agent/HumanInterfaceRequest";
import React, { useEffect, useState } from "react";
import {useAgentManager, useApp} from "../context/TokenRingAppProvider.tsx";
import HumanRequestDialog from "./HumanRequestDialog.tsx";

type Message = {
	type: "user" | "assistant" | "system";
	content: string;
};

type PendingRequest = {
	request: HumanInterfaceRequest;
	sequence: number;
};

const ChatInstance = ({
	agentId,
	isActive,
}: {
	agentId: string;
	isActive: boolean;
}) => {
	const agentManager = useAgentManager();
	const agent = agentManager?.getAgent(agentId) || null;
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [pendingRequest, setPendingRequest] = useState<PendingRequest | null>(
		null,
	);

	useEffect(() => {
		if (!agent || !isActive) return;

		const abortController = new AbortController();

		(async () => {
			for await (const event of agent.events(abortController.signal)) {
				switch (event.type) {
					case "output.chat":
						setMessages((prev) => [
							...prev,
							{ type: "assistant", content: event.data.content },
						]);
						break;
					case "output.system":
						setMessages((prev) => [
							...prev,
							{ type: "system", content: event.data.message },
						]);
						break;
					case "input.received":
						setMessages((prev) => [
							...prev,
							{ type: "user", content: event.data.message },
						]);
						break;
					case "human.request":
						setPendingRequest({
							request: event.data.request,
							sequence: event.data.sequence,
						});
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

	const handleHumanResponse = (sequence: number, response: any) => {
		if (agent) {
			agent.sendHumanResponse(sequence, response);
		}
		setPendingRequest(null);
	};

	if (!isActive) return null;

	return (
		<div className="h-full flex flex-col bg-white dark:bg-gray-900">
			{pendingRequest && (
				<HumanRequestDialog
					request={pendingRequest.request}
					sequence={pendingRequest.sequence}
					onResponse={handleHumanResponse}
				/>
			)}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((msg, i) => (
					<div
						key={i}
						className={`${msg.type === "user" ? "text-blue-600 dark:text-blue-400" : msg.type === "system" ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}
					>
						{msg.content}
					</div>
				))}
			</div>
			<form
				onSubmit={handleSubmit}
				className="border-t border-gray-300 dark:border-gray-700 p-4"
			>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg outline-none"
					placeholder="Type a message..."
				/>
			</form>
		</div>
	);
};

export default ChatInstance;
