import {AgentManager} from "@tokenring-ai/agent";
import TokenRingApp from "@tokenring-ai/app";
import React, { createContext, useContext } from "react";

const AgentTeamContext = createContext<TokenRingApp | null>(null);

export function TokenRingAppProvider({
	app,
	children,
}: {
	app: TokenRingApp | null;
	children: React.ReactNode;
}) {
	return (
		<AgentTeamContext.Provider value={app}>
			{children}
		</AgentTeamContext.Provider>
	);
}

export function useApp() {
	return useContext(AgentTeamContext);
}

export function useAgentManager() {
  return useApp()?.requireService(AgentManager);
}
