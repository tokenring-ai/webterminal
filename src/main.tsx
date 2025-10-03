import {AgentTeam, packageInfo as AgentPackage} from "@tokenring-ai/agent";
import {ModelRegistry, packageInfo as AIClientPackage} from "@tokenring-ai/ai-client";
import AIService from "@tokenring-ai/ai-client/AIService";
import {registerModels} from "@tokenring-ai/ai-client/models";
import BrowserFileSystem from "@tokenring-ai/browser-file-system/BrowserFileSystem.js";
import {FileSystemService, packageInfo as FilesystemPackage} from "@tokenring-ai/filesystem";
import React, {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import App from "./App.tsx";
import agents from "./config/agents.ts";
import {defaultChatConfig} from "./config/defaultChatConfig.ts";
import {AgentTeamProvider} from "./context/AgentTeamProvider.js";
import {ThemeProvider} from "./context/ThemeProvider.tsx";

import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

function TerminalCore() {
	const [team, setTeam] = useState<AgentTeam | null>(null);

	useEffect(() => {
		const initialize = async () => {
			const agentTeam = new AgentTeam();
			
			await agentTeam.addPackages([
				AgentPackage,
				AIClientPackage,
				FilesystemPackage,
			]);

			const modelRegistry = new ModelRegistry();
			await registerModels(defaultChatConfig.models, modelRegistry);

			const filesystemService = new FileSystemService();
			filesystemService.registerFileSystemProvider("browser", new BrowserFileSystem());
			filesystemService.setActiveFileSystemProviderName("browser");

			agentTeam.services.register(modelRegistry);
			agentTeam.services.register(filesystemService);
			agentTeam.services.register(new AIService({ model: defaultChatConfig.defaults?.model || "gpt-4" }));

			for (const name in agents) {
				agentTeam.addAgentConfig(name, agents[name as keyof typeof agents]);
			}

			setTeam(agentTeam);
		};

		initialize();
	}, []);

	if (!team) return <div>Loading...</div>;

	return (
		<AgentTeamProvider team={team}>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</AgentTeamProvider>
	);
}

root.render(
	<React.StrictMode>
		<TerminalCore />
	</React.StrictMode>,
);
