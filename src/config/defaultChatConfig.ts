import {z} from "zod";
import {configSchema} from "../plugins.ts";

import agents from "./agents.ts";

export const defaultChatConfig = configSchema.parse({
  app: {
    dataDirectory: 'n/a',
    configDirectories: [],
    configSchema
  },
  agents,
  chat: {
    defaultModels: ["LocalLLama:minimax/minimax-m2"],
  },
  ai: {
    providers: {
      LocalLLama: {
        provider: "generic",
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
  },
  browserFilesystem: {},
} satisfies z.input<typeof configSchema>);
