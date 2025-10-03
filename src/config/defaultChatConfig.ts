import { WebTerminalConfig } from "./config.types.js";

export const defaultChatConfig = {
	defaults: {
		agent: "code",
		model: "gpt-5", // Default model for the web terminal
	},
	agents: {},

	models: {
		LlamaCPP: {
			provider: "openaiCompatible",
			baseURL: "http://192.168.15.20:11434",
			apiKey: "sk-ABCD1234567890",
			generateModelSpec(modelInfo) {
				let { id: model } = modelInfo;
				model = model.replace(/:latest$/, "");
				model = model.replace(/^hf.co\/([^\/]*)\//, "");
				let type = "chat";
				let capabilities = {};
				if (model.match(/embed/i)) {
					type = "embedding";
				} else if (model.match(/qwen[23]/i)) {
					Object.assign(capabilities, {
						reasoning: 2,
						tools: 2,
						intelligence: 2,
						speed: 2,
						contextLength: 128000,
						costPerMillionInputTokens: 0,
						costPerMillionOutputTokens: 0,
					});
				}
				return { type, capabilities };
			},
		},
	},
} as WebTerminalConfig;
