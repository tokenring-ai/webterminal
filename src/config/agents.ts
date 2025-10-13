import type { AgentConfig } from "@tokenring-ai/agent/types";

export const interactiveCodeAgent: AgentConfig = {
	name: "Interactive Code Agent",
	description: "An interactive code assistant",
	type: "interactive",
	visual: {
		color: "green",
	},
	ai: {
		temperature: 0.2,
		topP: 0.1,
		systemPrompt:
			"You are an expert developer assistant with access to tools to update the codebase. " +
			"When the user tells you to do something, use the available tools to implement changes. " +
			"Give short and concise responses summarizing the code changes.",
	},
	initialCommands: ["/tools enable @tokenring-ai/filesystem/*"],
};

export default {
	interactiveCodeAgent,
};
