
import AgentPlugin from "@tokenring-ai/agent/plugin";
import AIClientPlugin from "@tokenring-ai/ai-client/plugin";
import TokenRingApp, {PluginManager} from "@tokenring-ai/app";
import ChatPlugin from "@tokenring-ai/chat/plugin";
import CheckpointPlugin from "@tokenring-ai/checkpoint/plugin";
import FilesystemPlugin from "@tokenring-ai/filesystem/plugin";
import MCPPlugin from "@tokenring-ai/mcp/plugin";
import MemoryPlugin from "@tokenring-ai/memory/plugin";
import QueuePlugin from "@tokenring-ai/queue/plugin";
import ScriptingPlugin from "@tokenring-ai/scripting/plugin";
import TestingPlugin from "@tokenring-ai/testing/plugin";
import BrowserAgentStoragePlugin from "@tokenring-ai/browser-agent-storage/plugin";
import BrowserFileSystemPlugin from "@tokenring-ai/browser-file-system/plugin";

import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { defaultChatConfig } from "./config/defaultChatConfig.ts";
import { TokenRingAppProvider } from "./context/TokenRingAppProvider.js";

import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

function TerminalCore() {
	const [app, setApp] = useState<TokenRingApp | null>(null);

	useEffect(() => {
		const initialize = async () => {
      const app = new TokenRingApp(import.meta.url, {}, defaultChatConfig);


      const pluginManager = new PluginManager(app)
      app.addServices(pluginManager);

      await pluginManager.installPlugins([
				AgentPlugin,
				AIClientPlugin,
				BrowserAgentStoragePlugin,
				BrowserFileSystemPlugin,
        ChatPlugin,
				CheckpointPlugin,
				//CodebasePlugin,
				FilesystemPlugin,
				MemoryPlugin,
        MCPPlugin,
				QueuePlugin,
        ScriptingPlugin,
				TestingPlugin,
			]);

			setApp(app);
      app.run();
		};

		initialize();
	}, []);

	if (!app) return <div>Loading...</div>;

	return (
		<TokenRingAppProvider app={app}>
			<App />
		</TokenRingAppProvider>
	);
}

root.render(
	<React.StrictMode>
		<TerminalCore />
	</React.StrictMode>,
);
