import { AgentPackageConfigSchema } from "@tokenring-ai/agent";
import { AIClientConfigSchema } from "@tokenring-ai/ai-client";
import {ChatClientConfigSchema} from "@tokenring-ai/chat";
import { CheckpointPackageConfigSchema } from "@tokenring-ai/checkpoint";
import { FileSystemConfigSchema } from "@tokenring-ai/filesystem";
import { z } from "zod";

import agents from "./agents.ts";

type WebTerminalConfig = {
	agents: z.infer<typeof AgentPackageConfigSchema>;
	ai: z.infer<typeof AIClientConfigSchema>;
  chat: z.infer<typeof ChatClientConfigSchema>
	filesystem: z.infer<typeof FileSystemConfigSchema>;
	checkpoint: z.infer<typeof CheckpointPackageConfigSchema>;
};

export const defaultChatConfig = {
	agents,
  chat: {
    defaultModel: "LocalLLama:glm/glm-air-4.5",
  },
	ai: {
    models: {
      Anthropic: {
        provider: "anthropic",
        apiKey: process.env.ANTHROPIC_API_KEY,
      },
      Azure: {
        provider: "azure",
        apiKey: process.env.AZURE_API_KEY,
        baseURL: process.env.AZURE_API_ENDPOINT,
      },
      Cerebras: {
        provider: "cerebras",
        apiKey: process.env.CEREBRAS_API_KEY,
      },
      DeepSeek: {
        provider: "deepseek",
        apiKey: process.env.DEEPSEEK_API_KEY,
      },
      Google: {
        provider: "google",
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      },
      Groq: {
        provider: "groq",
        apiKey: process.env.GROQ_API_KEY,
      },
      LLama: {
        provider: "openaiCompatible",
        apiKey: process.env.LLAMA_API_KEY,
        baseURL: 'https://api.llama.com/compat/v1',
      },
      OpenAI: {
        provider: "openai",
        apiKey: process.env.OPENAI_API_KEY
      },
      LlamaCPP: {
        provider: "openaiCompatible",
        baseURL: "http://192.168.15.20:11434",
        apiKey: "sk-ABCD1234567890",
      },
      LocalLLama: {
        provider: "openaiCompatible",
        baseURL: "http://192.168.15.25:11434/v1",
        apiKey: "sk-ABCD1234567890"
      },
      OpenRouter: {
        provider: "openrouter",
        apiKey: process.env.OPENROUTER_API_KEY
      },
      Perplexity: {
        provider: "perplexity",
        apiKey: process.env.PERPLEXITY_API_KEY,
      },
      Qwen: {
        provider: "openaiCompatible",
        apiKey: process.env.DASHSCOPE_API_KEY,
        baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
      },
      xAi: {
        provider: "xai",
        apiKey: process.env.XAI_API_KEY,
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
