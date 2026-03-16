import AgentPlugin from "@tokenring-ai/agent/plugin";
import AIClientPlugin from "@tokenring-ai/ai-client/plugin";
import {TokenRingAppConfigSchema} from "@tokenring-ai/app/TokenRingApp";
import BrowserStoragePlugin from "@tokenring-ai/browser-storage/plugin";
import BrowserFileSystemPlugin from "@tokenring-ai/browser-file-system/plugin";
import ChatPlugin from "@tokenring-ai/chat/plugin";
import FilesystemPlugin from "@tokenring-ai/filesystem/plugin";
import MCPPlugin from "@tokenring-ai/mcp/plugin";
import MemoryPlugin from "@tokenring-ai/memory/plugin";
import QueuePlugin from "@tokenring-ai/queue/plugin";
import ScriptingPlugin from "@tokenring-ai/scripting/plugin";
import TestingPlugin from "@tokenring-ai/testing/plugin";
import {z} from "zod";

export const plugins = [
  AgentPlugin,
  AIClientPlugin,
  BrowserStoragePlugin,
  BrowserFileSystemPlugin,
  ChatPlugin,
  FilesystemPlugin,
  MemoryPlugin,
  MCPPlugin,
  QueuePlugin,
  ScriptingPlugin,
  TestingPlugin,
];
export const configSchema = z.object({
  ...TokenRingAppConfigSchema.shape,
  ...AgentPlugin.config.shape,
  ...AIClientPlugin.config.shape,
  ...BrowserStoragePlugin.config.shape,
  ...BrowserFileSystemPlugin.config.shape,
  ...ChatPlugin.config.shape,
  ...FilesystemPlugin.config.shape,
  ...MemoryPlugin.config.shape,
  ...MCPPlugin.config.shape,
  ...QueuePlugin.config.shape,
  ...ScriptingPlugin.config.shape,
  ...TestingPlugin.config.shape,
});