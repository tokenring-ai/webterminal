import React, { useState, useCallback, useContext } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import clsx from "clsx";
import { ThemeProvider } from "./context/ThemeProvider";
import MainPanel from "./components/MainPanel";
import { RegistryContext } from "./context/RegistryProvider";
import { ConfigurationManagementService } from "@token-ring/config";
import { defaultChatConfig } from "./config/defaultChatConfig"; // Keep for fallback
import { v4 as uuidv4 } from "uuid";

/**
 * @returns {JSX.Element}
 */
function App() {
	const [isMaximized, setIsMaximized] = useState(false);
	const [height, setHeight] = useState(300); // initial height in px

	// Chat tabs: { id, title, type: 'chat', configService }
	// File tabs: { id, title, type: 'file', filePath }
	const [tabs, setTabs] = useState([]);
	const [activeTabId, setActiveTabId] = useState(null);

	const globalRegistry = useContext(RegistryContext);
	// Get the global config service instance.
	// This assumes globalRegistry is always available because TerminalCore provides it.
	const globalConfigService = globalRegistry?.requireFirstServiceByType(
		ConfigurationManagementService,
	);

	const handleNewChat = useCallback(() => {
		const newChatId = uuidv4();

		let initialConfigForNewChat;
		if (globalConfigService) {
			// Deep clone the current global configuration
			initialConfigForNewChat = JSON.parse(
				JSON.stringify(globalConfigService.getConfiguration()),
			);
		} else {
			// Fallback if globalConfigService is somehow not available (should not happen in normal flow)
			console.warn(
				"Global ConfigurationManagementService not found. Initializing new chat with local defaultChatConfig.",
			);
			initialConfigForNewChat = JSON.parse(JSON.stringify(defaultChatConfig));
		}

		// Add the unique chatId to the configuration for this tab
		const tabId = `chat-${newChatId}`;
		initialConfigForNewChat.id = tabId; // use 'id' to match useChat's preference
		// Alternatively, use initialConfigForNewChat.chatId = tabId; if that's more consistent elsewhere

		const newConfigService = new ConfigurationManagementService(
			initialConfigForNewChat,
		);

		const newTab = {
			id: tabId,
			title: `Chat ${tabs.filter((t) => t.type === "chat").length + 1}`,
			type: "chat",
			configService: newConfigService,
		};
		setTabs((prevTabs) => [...prevTabs, newTab]);
		setActiveTabId(newTab.id);
	}, [tabs, globalConfigService]); // Added globalConfigService to deps, good practice if it's used.

	// openChatTab (original) - can be deprecated or adapted if Sidebar's role changes
	// For now, let's keep it but it's not used by the "New Chat" button
	const openChatTab = useCallback((chatId, title) => {
		const id = `chat-${chatId}`; // This assumes chatId is not a full uuid from new system
		setTabs((prev) => {
			if (prev.find((t) => t.id === id)) return prev;
			// This old version doesn't create a configService, so it's incompatible
			// with ChatInstance expecting one. This would need a larger refactor
			// or this function is removed if Sidebar only opens existing chats
			// or uses handleNewChat.
			// For now, to avoid breaking Sidebar if it calls this:
			// return [...prev, { id, title, type: 'chat', chatId }];
			// However, this tab won't work with the new ChatInstance.
			// Better to comment out its usage or adapt Sidebar.
			// For this step, we focus on handleNewChat.
			console.warn(
				"Legacy openChatTab called, may not work with new ChatInstance expecting configService",
			);
			return prev;
		});
		// setActiveTabId(id);
	}, []);

	const openFileTab = useCallback((filePath) => {
		const id = `file-${filePath}`;
		const title = filePath.split("/").pop();
		setTabs((prev) => {
			if (prev.find((t) => t.id === id)) return prev;
			return [...prev, { id, title, type: "file", filePath }];
		});
		setActiveTabId(id);
	}, []);

	const closeTab = useCallback(
		(idToClose) => {
			// Future: If configService in a tab needs explicit cleanup, do it here.
			// const tabToClose = tabs.find(t => t.id === idToClose);
			// if (tabToClose && tabToClose.type === 'chat' && tabToClose.configService) {
			//   // tabToClose.configService.dispose(); // or similar cleanup method
			// }

			setTabs((prevTabs) => {
				const newTabs = prevTabs.filter((t) => t.id !== idToClose);
				if (activeTabId === idToClose) {
					setActiveTabId(newTabs.length > 0 ? newTabs[0].id : null);
				}
				return newTabs;
			});
		},
		[activeTabId, tabs],
	);

	const selectTab = useCallback((id) => {
		setActiveTabId(id);
	}, []);

	return (
		<ThemeProvider>
			<div className="h-full flex flex-col">
				<div
					className={clsx(
						"fixed left-0 right-0",
						isMaximized ? "top-0 bottom-0" : "bottom-0",
						"flex flex-col",
					)}
					style={!isMaximized ? { height } : undefined}
				>
					<TopBar
						onMaximize={() => setIsMaximized((m) => !m)}
						isMaximized={isMaximized}
						onResize={(delta) =>
							setHeight((h) =>
								Math.min(window.innerHeight, Math.max(200, h - delta)),
							)
						}
					/>
					<div className="flex flex-1 overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-t border-zinc-300 dark:border-zinc-700">
						<Sidebar
							onChatSelect={openChatTab}
							onFileOpen={openFileTab}
							chatTabs={tabs.filter((t) => t.type === "chat")} // Pass only chat tabs
							onNewChat={handleNewChat} // Pass handleNewChat
						/>
						<MainPanel
							tabs={tabs}
							activeTabId={activeTabId}
							onSelect={selectTab}
							onClose={closeTab}
							handleNewChat={handleNewChat}
						/>
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
}

export default App;
