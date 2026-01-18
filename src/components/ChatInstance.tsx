import {QuestionResponseSchema} from "@tokenring-ai/agent/AgentEvents";
import { AgentEventState } from "@tokenring-ai/agent/state/agentEventState";
import {AgentExecutionState} from "@tokenring-ai/agent/state/agentExecutionState";
import React, { useEffect, useState } from "react";
import {useAgentManager} from "../context/TokenRingAppProvider.tsx";
import HumanRequestDialog from "./HumanRequestDialog.tsx";
import z from "zod";

type Message = {
	type: "output.chat" | "output.info" | "output.error" | "output.warning" | "input.received",
	message: string;
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

	useEffect(() => {
		if (!agent || !isActive) return;

		const unsubscribe = agent.subscribeState(AgentEventState, (state) => {
			const newMessages: Message[] = [];
			for (const event of state.events) {
				switch (event.type) {
					case "output.chat":
          case 'output.info':
          case 'output.warning':
          case 'output.error':
					case "input.received":
						newMessages.push(event);
						break;
				}
			}
			setMessages(newMessages);
		});

		return () => unsubscribe();
	}, [agent, isActive]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!agent || !input.trim()) return;
		agent.handleInput({ message: input });
		setInput("");
	};
	const waitingOn = agent?.getState(AgentExecutionState)?.waitingOn;

	const handleHumanResponse = (requestId: string, response: z.output<typeof QuestionResponseSchema>) => {
		agent?.sendQuestionResponse(requestId, {result: response});
	};

	if (!isActive) return null;


  const colorClasses = {
    'input.received': 'text-blue-600 dark:text-blue-400',
    'output.chat': 'text-gray-900 dark:text-white',
    'output.info': 'text-gray-500 dark:text-gray-400',
    'output.warning': 'text-yellow-600 dark:text-yellow-400',
    'output.error': 'text-red-600 dark:text-red-400'
  }
	return (
		<div className="h-full flex flex-col bg-white dark:bg-gray-900">
			{waitingOn && waitingOn.length > 0 && (
				<HumanRequestDialog
					request={waitingOn[0]}
					requestId={waitingOn[0].requestId}
					onResponse={handleHumanResponse}
				/>
			)}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((msg, i) => (
					<div
						key={i}
						className={`${colorClasses[msg.type]}`}
					>
						{msg.message}
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
