import type Agent from "@tokenring-ai/agent/Agent";
import { useAgentTeam } from "../context/AgentTeamProvider.js";

export function useAgent(agentId: string): Agent | null {
	const team = useAgentTeam();
	if (!team) return null;
	return team.getAgent(agentId) || null;
}

export default useAgent;
