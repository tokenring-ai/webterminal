import {AgentManager} from "@tokenring-ai/agent";
import type Agent from "@tokenring-ai/agent/Agent";
import { useApp } from "../context/TokenRingAppProvider.js";

export function useAgent(agentId: string): Agent | null {
	const app = useApp();
	if (!app) return null;

  const agentManager = app.requireService(AgentManager);
	return agentManager.getAgent(agentId) || null;
}

export default useAgent;
