import { AgentTeam, packageInfo as AgentPackage } from "@tokenring-ai/agent";
import { packageInfo as AIClientPackage } from "@tokenring-ai/ai-client";
import { packageInfo as BrowserAgentStoragePackage } from "@tokenring-ai/browser-agent-storage";
import { packageInfo as BrowserFileSystemPackage } from "@tokenring-ai/browser-file-system";
import { packageInfo as CheckpointPackage } from "@tokenring-ai/checkpoint";
//import {packageInfo as CodebasePackage} from "@tokenring-ai/codebase";
import {
	FileSystemService,
	packageInfo as FilesystemPackage,
} from "@tokenring-ai/filesystem";
import { packageInfo as IterablesPackage } from "@tokenring-ai/iterables";
import { packageInfo as MemoryPackage } from "@tokenring-ai/memory";
import { packageInfo as QueuePackage } from "@tokenring-ai/queue";
import { packageInfo as TestingPackage } from "@tokenring-ai/testing";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { defaultChatConfig } from "./config/defaultChatConfig.ts";
import { AgentTeamProvider } from "./context/AgentTeamProvider.js";
import { ThemeProvider } from "./context/ThemeProvider.tsx";

import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

function TerminalCore() {
	const [team, setTeam] = useState<AgentTeam | null>(null);

	useEffect(() => {
		const initialize = async () => {
			const agentTeam = new AgentTeam(defaultChatConfig);

			await agentTeam.addPackages([
				AgentPackage,
				AIClientPackage,
				BrowserAgentStoragePackage,
				BrowserFileSystemPackage,
				CheckpointPackage,
				//CodebasePackage,
				FilesystemPackage,
				IterablesPackage,
				MemoryPackage,
				QueuePackage,
				TestingPackage,
			]);

			setTeam(agentTeam);
		};

		initialize();
	}, []);

	if (!team) return <div>Loading...</div>;

	return (
		<AgentTeamProvider team={team}>
			<App />
		</AgentTeamProvider>
	);
}

root.render(
	<React.StrictMode>
		<TerminalCore />
	</React.StrictMode>,
);
