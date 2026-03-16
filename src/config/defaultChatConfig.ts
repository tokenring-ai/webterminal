import {z} from "zod";
import {configSchema} from "../plugins.ts";

import agents from "./agents.ts";

export const defaultChatConfig = configSchema.parse({
  app: {
    dataDirectory: 'n/a',
    configFileName: 'n/a',
    configSchema
  },
  agents: {
    app: agents,
  },
  chat: {
    defaultModels: ["LocalLLama:minimax/minimax-m2"],
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
    agentDefaults: {
      provider: "browser",
      workingDirectory: "/",
    },
    providers: {
      browser: {
        type: "browser",
      },
    },
  },
} satisfies z.input<typeof configSchema>);
