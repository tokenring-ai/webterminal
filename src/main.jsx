import React, { useMemo } from "react"; // useMemo might be good for registry/service instances
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeProvider";
import "./index.css";
import App from "./App";
import { Registry } from "@token-ring/registry"; // Added
import { RegistryProvider } from "./context/RegistryProvider"; // Added/Re-added
import { ConfigurationManagementService } from "@token-ring/config"; // Added
import { defaultChatConfig } from "./config/defaultChatConfig"; // Added
// Removed BrowserChatHistoryService import, as it's now managed per-tab by useChat.js
// import { BrowserChatHistoryService } from '../../../web/browser-chat-storage/BrowserChatHistoryService';
// It's good practice to ensure ConfigPackage is also "known" if its services have specific registration needs.
// import * as ConfigPackage from '@token-ring/config';

const container = document.getElementById("root");
const root = createRoot(container);

function TerminalCore() {
	// Create global instances only once. useMemo can help ensure this.
	const globalRegistry = useMemo(() => {
		const registry = new Registry();
		// If registry.start() is asynchronous or has side effects beyond setup,
		// it might need to be handled in a useEffect, but for synchronous setup:
		// registry.start(); // Assuming synchronous or not needed before adding services like CMS

		// It's generally better to ensure packages are added if services rely on package-level registrations
		// (e.g. service type definitions for discovery).
		// If ConfigurationManagementService.register is a static method on the class,
		// or if the ConfigPackage has a registerServices(registry) method:
		// ConfigPackage.registerServices(registry); // or similar if exists
		// For now, directly adding the service instance:

		const configService = new ConfigurationManagementService(defaultChatConfig);
		// const chatHistoryService = new BrowserChatHistoryService(); // REMOVED - Managed by useChat.js
		registry.services.addServices(configService);
		// registry.services.addServices(chatHistoryService); // REMOVED
		// If it expects an array: addServices([configService])

		// After all services that need to be globally available are added:
		// await registry.start(); // If start is async and needed after services are added.
		// For now, assuming CMS can be added and used without an explicit start/stop on the global registry for this simple case.
		// The per-chat registries created by useChat DO call start().

		return registry;
	}, []);

	return (
		<RegistryProvider registry={globalRegistry}>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</RegistryProvider>
	);
}

root.render(
	<React.StrictMode>
		<TerminalCore />
	</React.StrictMode>,
);
