import { AgentPackageConfigSchema } from "@tokenring-ai/agent";
import { AIClientConfigSchema } from "@tokenring-ai/ai-client";
import { CheckpointPackageConfigSchema } from "@tokenring-ai/checkpoint";
import { FileSystemConfigSchema } from "@tokenring-ai/filesystem";
import { z } from "zod";

import agents from "./agents.ts";

type WebTerminalConfig = {
	agents: z.infer<typeof AgentPackageConfigSchema>;
	ai: z.infer<typeof AIClientConfigSchema>;
	filesystem: z.infer<typeof FileSystemConfigSchema>;
	checkpoint: z.infer<typeof CheckpointPackageConfigSchema>;
};

export const defaultChatConfig = {
	agents,
	ai: {
		defaultModel: "OpenAI:gpt-5",
		models: {
			LlamaCPP: {
				provider: "openaiCompatible",
				baseURL: "http://192.168.15.25:11434/v1",
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
	},
	filesystem: {
		defaultProvider: "browser",
		providers: {
			browser: {
				type: "browser",
			},
		},
	},
	checkpoint: {
		defaultProvider: "browser",
		providers: {
			browser: {
				type: "browser",
			},
		},
	},
} as WebTerminalConfig;
