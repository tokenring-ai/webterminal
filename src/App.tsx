import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MainPanel from "./components/MainPanel.tsx";
import Sidebar from "./components/Sidebar.tsx";
import Terminal from "./components/Terminal.tsx";
import TopBar from "./components/TopBar.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";

type Tab = {
	id: string;
	title: string;
	type: "chat" | "file";
	filePath?: string;
	agentId?: string;
};

function App() {
	const [tabs, setTabs] = useState<Tab[]>([]);
	const [activeTabId, setActiveTabId] = useState<string | null>(null);
	const [terminalHeight, setTerminalHeight] = useState(256);

	const handleNewChat = useCallback(() => {
		const newChatId = uuidv4();
		const tabId = `chat-${newChatId}`;
		const newTab: Tab = {
			id: tabId,
			title: `Chat ${tabs.filter((t) => t.type === "chat").length + 1}`,
			type: "chat",
			agentId: newChatId,
		};
		setTabs((prevTabs) => [...prevTabs, newTab]);
		setActiveTabId(newTab.id);
	}, [tabs]);

	const openFileTab = useCallback((filePath: string) => {
		const id = `file-${filePath}`;
		const title = filePath.split("/").pop() || filePath;
		setTabs((prev) => {
			if (prev.find((t) => t.id === id)) return prev;
			return [...prev, { id, title, type: "file" as const, filePath }];
		});
		setActiveTabId(id);
	}, []);

	const closeTab = useCallback(
		(idToClose: string) => {
			setTabs((prevTabs) => {
				const newTabs = prevTabs.filter((t) => t.id !== idToClose);
				if (activeTabId === idToClose) {
					setActiveTabId(newTabs.length > 0 ? newTabs[0].id : null);
				}
				return newTabs;
			});
		},
		[activeTabId],
	);

	const selectTab = useCallback((id: string) => {
		setActiveTabId(id);
	}, []);

	return (
		<ThemeProvider>
			<div className="h-screen flex flex-col bg-gray-900 text-gray-100 overflow-hidden">
				<TopBar />
				<div className="flex flex-1 overflow-hidden">
					<Sidebar
						onFileOpen={openFileTab}
						chatTabs={tabs.filter((t) => t.type === "chat")}
						onNewChat={handleNewChat}
						onSelectTab={selectTab}
					/>
					<div className="flex-1 flex flex-col overflow-hidden">
						<div className="flex-1 overflow-hidden">
							<MainPanel
								tabs={tabs}
								activeTabId={activeTabId}
								onSelect={selectTab}
								onClose={closeTab}
								handleNewChat={handleNewChat}
							/>
						</div>
						<Terminal height={terminalHeight} onResize={setTerminalHeight} />
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
}

export default App;
