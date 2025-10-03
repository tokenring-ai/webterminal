import type AgentTeam from "@tokenring-ai/agent/AgentTeam";
import React, {createContext, useContext} from "react";

const AgentTeamContext = createContext<AgentTeam | null>(null);

export function AgentTeamProvider({ team, children }: { team: AgentTeam | null; children: React.ReactNode }) {
	return (
		<AgentTeamContext.Provider value={team}>
			{children}
		</AgentTeamContext.Provider>
	);
}

export function useAgentTeam() {
	return useContext(AgentTeamContext);
}
