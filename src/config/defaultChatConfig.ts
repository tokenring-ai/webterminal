import { AgentPackageConfigSchema } from "@tokenring-ai/agent";
import { AIClientConfigSchema } from "@tokenring-ai/ai-client";
import {ChatClientConfigSchema} from "@tokenring-ai/chat";
import { CheckpointPackageConfigSchema } from "@tokenring-ai/checkpoint";
import { FileSystemConfigSchema } from "@tokenring-ai/filesystem";
import { z } from "zod";

import agents from "./agents.ts";

type WebTerminalConfig = {
	agents: z.input<typeof AgentPackageConfigSchema>;
	ai: z.input<typeof AIClientConfigSchema>;
  chat: z.input<typeof ChatClientConfigSchema>
	filesystem: z.input<typeof FileSystemConfigSchema>;
	checkpoint: z.input<typeof CheckpointPackageConfigSchema>;
};

export const defaultChatConfig = {
	agents,
  chat: {
    defaultModel: "LocalLLama:minimax/minimax-m2",
  },
  ai: {
    providers: {
      LocalLLama: {
        provider: "openaiCompatible",
        baseURL: "http://192.168.15.25:11434/v1",
        apiKey: "sk-ABCD1234567890"
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
