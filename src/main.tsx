
import AgentPackage, {AgentManager} from "@tokenring-ai/agent";
import AIClientPackage from "@tokenring-ai/ai-client";
import TokenRingApp, {PluginManager} from "@tokenring-ai/app";
import ChatPackage from "@tokenring-ai/chat";
import CheckpointPackage from "@tokenring-ai/checkpoint";
import FilesystemPackage from "@tokenring-ai/filesystem";
import MCPPackage from "@tokenring-ai/mcp";
import MemoryPackage from "@tokenring-ai/memory";
import QueuePackage from "@tokenring-ai/queue";
import ScriptingPackage from "@tokenring-ai/scripting";
import TestingPackage from "@tokenring-ai/testing";
import BrowserAgentStoragePackage from "@tokenring-ai/browser-agent-storage";
import BrowserFileSystemPackage from "@tokenring-ai/browser-file-system";

import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import agents from "./config/agents.ts";
import { defaultChatConfig } from "./config/defaultChatConfig.ts";
import { TokenRingAppProvider } from "./context/TokenRingAppProvider.js";
import { ThemeProvider } from "./context/ThemeProvider.tsx";

import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

function TerminalCore() {
	const [app, setApp] = useState<TokenRingApp | null>(null);

	useEffect(() => {
		const initialize = async () => {
      const app = new TokenRingApp(defaultChatConfig);


      const pluginManager = new PluginManager(app)
      app.addServices(pluginManager);

      await pluginManager.installPlugins([
				AgentPackage,
				AIClientPackage,
				BrowserAgentStoragePackage,
				BrowserFileSystemPackage,
        ChatPackage,
				CheckpointPackage,
				//CodebasePackage,
				FilesystemPackage,
				MemoryPackage,
        MCPPackage,
				QueuePackage,
        ScriptingPackage,
				TestingPackage,
			]);


      const agentManager = app.requireService(AgentManager);

			setApp(app);
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
