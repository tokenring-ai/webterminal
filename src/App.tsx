import React, { useCallback, useState } from "react";
import MainPanel from "./components/MainPanel.tsx";
import Sidebar from "./components/Sidebar.tsx";
import Terminal from "./components/Terminal.tsx";
import TopBar from "./components/TopBar.tsx";
import {useAgentManager} from "./context/TokenRingAppProvider.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";

type Tab = {
	id: string;
	title: string;
	type: "chat" | "file";
	filePath?: string;
	agentId?: string;
};

type TerminalTab = {
	id: string;
	title: string;
	agentId: string;
};

function App() {
	const agentManager = useAgentManager();
	const [activeView, setActiveView] = useState("agents");
	const [tabs, setTabs] = useState<Tab[]>([]);
	const [terminalTabs, setTerminalTabs] = useState<TerminalTab[]>([]);
	const [activeTerminalId, setActiveTerminalId] = useState<string | null>(null);
	const [terminalHeight, setTerminalHeight] = useState(256);

	const handleNewChat = useCallback(async () => {
		if (!agentManager) return;
		const agent = await agentManager.spawnAgent({ agentType: "interactiveCodeAgent", headless: false });
		const newTab: TerminalTab = {
			id: agent.id,
			title: agent.config.name,
			agentId: agent.id,
		};
		setTerminalTabs((prev) => [...prev, newTab]);
		setActiveTerminalId(newTab.id);
	}, [agentManager, terminalTabs]);

	const openFileTab = useCallback((filePath: string) => {
		const id = `file-${filePath}`;
		const title = filePath.split("/").pop() || filePath;
		setTabs((prev) => {
			const existing = prev.find((t) => t.id === id);
			if (existing) return prev;
			return [{ id, title, type: "file" as const, filePath }];
		});
		setActiveView("files");
	}, []);

	const closeTab = useCallback((idToClose: string) => {
		setTabs((prev) => prev.filter((t) => t.id !== idToClose));
	}, []);

	const selectChatTab = useCallback((id: string) => {
		setActiveTerminalId(id);
	}, []);

	const closeTerminal = useCallback(
		(id: string) => {
			if (!agentManager) return;
			const tab = terminalTabs.find((t) => t.id === id);
			if (tab) {
				const agent = agentManager.getAgent(tab.agentId);
				if (agent) agentManager.deleteAgent(agent);
			}
			setTerminalTabs((prev) => {
				const newTabs = prev.filter((t) => t.id !== id);
				if (activeTerminalId === id) {
					setActiveTerminalId(newTabs.length > 0 ? newTabs[0].id : null);
				}
				return newTabs;
			});
		},
		[agentManager, terminalTabs, activeTerminalId],
	);

	return (
		<ThemeProvider>
			<div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
				<TopBar />
				<div className="flex flex-1 overflow-hidden">
					<Sidebar activeView={activeView} onViewChange={setActiveView} />
					<div className="flex-1 flex flex-col overflow-hidden">
						<div className="flex-1 overflow-hidden">
							<MainPanel
								activeView={activeView}
								tabs={tabs}
								onFileOpen={openFileTab}
								onFileClose={closeTab}
								onNewChat={handleNewChat}
								onSelectChatTab={selectChatTab}
							/>
						</div>
						<Terminal
							height={terminalHeight}
							onResize={setTerminalHeight}
							terminalTabs={terminalTabs}
							activeTerminalId={activeTerminalId}
							onSelectTerminal={setActiveTerminalId}
							onCloseTerminal={closeTerminal}
							onNewAgent={handleNewChat}
						/>
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
}

export default App;
