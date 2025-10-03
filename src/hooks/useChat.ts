import AgentTeam from "@tokenring-ai/agent/AgentTeam";
import * as AIClientPackage from "@tokenring-ai/ai-client";
import { ModelRegistry } from "@tokenring-ai/ai-client";
import { registerModels } from "@tokenring-ai/ai-client/models";
import * as models from "@tokenring-ai/ai-client/models"; // For default models
import {
	BrowserChatHistoryService,
	BrowserCheckpointService,
	packageInfo as BrowserChatStoragePackage,
} from "pkg/browser-agent-storage";
import {
	BrowserFileSystem,
	packageInfo as BrowserFileSystemPackage,
} from "@tokenring-ai/browser-file-system";
import ConfigurationManagementService from "@tokenring-ai/config/services/ConfigurationManagementService.js";
import * as FilesystemPackage from "@tokenring-ai/filesystem";
import * as HistoryPackage from "@tokenring-ai/history";
import * as MemoryPackage from "@tokenring-ai/memory";
import { ShortTermMemoryService } from "@tokenring-ai/memory";
import * as QueuePackage from "@tokenring-ai/queue";
import { WorkQueueService } from "@tokenring-ai/queue";
import { useEffect, useState } from "react";
import { WebTerminalConfig } from "../config/config.types.js";

// Default personas, can be overridden by config
const defaultPersonas = {
	code: {
		instructions: "You are an expert developer assistant...", // Truncated for brevity
		model: "auto:speed>=4,intelligence>=3",
	},
	architect: {
		instructions: "You are a software architect...", // Truncated for brevity
		model: "auto:reasoning>=5,intelligence>=5",
	},
};

/**
 * Custom hook to initialize and manage a dedicated chat environment (Registry and services)
 * for a single chat instance.
 *
 * @param {ConfigurationManagementService} configServiceInstance - The configuration service instance for this chat.
 *        It's assumed that this service's configuration might contain a unique ID (e.g., `chatId` or `id`)
 *        that can be used for namespacing browser storage.
 * @returns {{registry: Registry|null, error: Error|null, isLoading: boolean}}
 */
export const useChat = (
	configServiceInstance: ConfigurationManagementService,
) => {
	const [registry, setAgentTeam] = useState<AgentTeam | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!configServiceInstance) {
			setAgentTeam(null);
			setError(null);
			return;
		}

		let agentTeam: AgentTeam | null = null;

		const initialize = async () => {
			try {
				const actualConfig = configServiceInstance.getConfiguration();

				console.log(
					`useChat: Initializing chat environment with config from service.`,
					actualConfig,
				);
				agentTeam = new AgentTeam();

				await agentTeam.addPackages([
					AIClientPackage.packageInfo,
					MemoryPackage.packageInfo,
					QueuePackage.packageInfo,
					HistoryPackage.packageInfo,
					BrowserFileSystemPackage,
					BrowserChatStoragePackage,
					FilesystemPackage.packageInfo,
				]);

				const modelRegistry = new ModelRegistry();
				await registerModels(actualConfig.models, modelRegistry);

				agentTeam.services.register([configServiceInstance]);
				agentTeam.services.register([modelRegistry]);
				agentTeam.services.register([new BrowserFileSystem()]);
				agentTeam.services.register([new ShortTermMemoryService()]);
				agentTeam.services.register([new WorkQueueService()]);
				agentTeam.services.register([new BrowserCheckpointService("")]);
				agentTeam.services.register([new BrowserChatHistoryService("")]);

				setAgentTeam(agentTeam);
				setError(null); // Clear any previous error
				console.log("useChat: Chat environment initialized successfully.");
			} catch (e) {
				console.error("useChat: Failed to initialize chat environment:", e);
				setError(e as Error);
				setAgentTeam(null);
			}
		};

		initialize();

		return () => {
			console.log("useChat: Cleanup chat environment.");
			setAgentTeam(null); // Clear registry on cleanup
			setError(null); // Clear error on cleanup as well
		};
	}, [configServiceInstance]); // Re-run effect if configServiceInstance changes

	return {
		registry,
		error,
		isLoading: !registry && !error && !!configServiceInstance,
	};
};

export default useChat;
