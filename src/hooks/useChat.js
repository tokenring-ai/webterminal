import { useState, useEffect } from 'react';
import { Registry } from "@token-ring/registry";
import * as ChatPackage from "@token-ring/chat";
import { ChatService } from "@token-ring/chat";
import * as AIClientPackage from "@token-ring/ai-client";
import { ModelRegistry } from "@token-ring/ai-client";
import * as models from "@token-ring/ai-client/models"; // For default models
import * as RegistryPackage from "@token-ring/registry";
import * as MemoryPackage from "@token-ring/memory";
import { EphemeralMemoryService } from "@token-ring/memory";
import * as QueuePackage from "@token-ring/queue";
import { WorkQueueService } from "@token-ring/queue";
import * as HistoryPackage from "@token-ring/history";
import * as BrowserChatStoragePackage from "@token-ring/browser-chat-storage";
import { BrowserChatMessageStorage, BrowserChatHistoryService, BrowserCheckpointService } from "@token-ring/browser-chat-storage";
import * as BrowserFileSystemPackage from "@token-ring/browser-file-system";
import BrowserFileSystem from "@token-ring/browser-file-system/BrowserFileSystem.js";
import * as FilesystemPackage from "@token-ring/filesystem";
import * as ConfigPackage from '@token-ring/config';
import { ConfigurationManagementService } from '@token-ring/config';

// Default personas, can be overridden by config
const defaultPersonas = {
  "code": {
    instructions: "You are an expert developer assistant...", // Truncated for brevity
    model: "auto:speed>=4,intelligence>=3",
  },
  "architect": {
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
export const useChat = (configServiceInstance) => {
  const [registry, setRegistry] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!configServiceInstance) {
      setRegistry(null);
      setError(null);
      return;
    }

    let newRegistry;

    const initialize = async () => {
      try {
        const actualConfig = configServiceInstance.getConfiguration();
        // Attempt to get a unique ID for this chat instance from the config.
        // This ID will be used to namespace localStorage.
        const chatInstanceId = actualConfig.id || actualConfig.chatId;
        if (!chatInstanceId) {
          console.warn("useChat: No 'id' or 'chatId' found in configServiceInstance's configuration. Browser storage services might not be properly isolated.");
          // Potentially fall back to a default or throw an error, depending on strictness.
          // For now, it will use the default prefix if chatInstanceId is undefined.
        }

        console.log(`useChat: Initializing chat environment with config from service. Instance ID for storage: ${chatInstanceId}`, actualConfig);
        newRegistry = new Registry();
        await newRegistry.start();

        await newRegistry.addPackages(
          ChatPackage, AIClientPackage, RegistryPackage, MemoryPackage,
          QueuePackage, HistoryPackage, BrowserFileSystemPackage,
          BrowserChatStoragePackage, FilesystemPackage, ConfigPackage
        );

        const currentDefaults = actualConfig.defaults || {};
        const currentModelsConfig = actualConfig.models || {};
        const currentPersonas = currentDefaults.personas || defaultPersonas;
        const currentPersona = currentDefaults.persona || "code";

        const chatService = new ChatService({
          personas: currentPersonas,
          persona: currentPersona,
        });

        const modelRegistry = new ModelRegistry();
        // Pass only the ai-client relevant models from config, and default library models
        await modelRegistry.initializeModels({ ...models, ...currentModelsConfig.libraryModels }, currentModelsConfig);


        await newRegistry.services.addServices(
          configServiceInstance,
          chatService,
          modelRegistry,
          new BrowserFileSystem(), // This service doesn't seem to persist to localStorage in its current form.
          new EphemeralMemoryService(), // In-memory, no prefix needed.
          new BrowserChatMessageStorage({ storagePrefix: chatInstanceId ? `${chatInstanceId}_messages_` : undefined }),
          new WorkQueueService(), // In-memory or uses other persistence; assume no prefix needed here unless specified.
          new BrowserCheckpointService(chatInstanceId), // Pass chatId as instanceId for namespacing
          new BrowserChatHistoryService(chatInstanceId) // Pass chatId as storageKeyPrefix
        );

        const defaultToolsList = Object.keys({
          ...(FilesystemPackage.tools || {}),
          ...(MemoryPackage.tools || {}),
        });
        await newRegistry.tools.enableTools(currentDefaults.tools || defaultToolsList);

        setRegistry(newRegistry);
        setError(null); // Clear any previous error
        console.log('useChat: Chat environment initialized successfully.');

      } catch (e) {
        console.error('useChat: Failed to initialize chat environment:', e);
        setError(e);
        setRegistry(null);
      }
    };

    initialize();

    return () => {
      // Cleanup: Stop the registry and any services if they have stop methods
      if (newRegistry && typeof newRegistry.stop === 'function') {
        console.log("useChat: Stopping registry.");
        try {
          newRegistry.stop();
        } catch (stopErr) {
          console.error("useChat: Error stopping registry", stopErr);
        }
      }
      // Individual services might also need to be stopped or cleaned up if they hold resources.
      // For now, this is a placeholder for more sophisticated cleanup.
      setRegistry(null); // Clear registry on cleanup
      setError(null); // Clear error on cleanup as well
    };
  }, [configServiceInstance]); // Re-run effect if configServiceInstance changes

  return { registry, error, isLoading: !registry && !error && !!configServiceInstance };
};

export default useChat;
