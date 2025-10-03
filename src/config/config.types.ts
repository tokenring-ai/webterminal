import { AgentConfig } from "@tokenring-ai/agent/Agent";
import { ModelProviderConfig } from "@tokenring-ai/ai-client/models";
import BrowserFileSystem from "@tokenring-ai/browser-file-system/BrowserFileSystem.js";
import { FileMatchResourceConfig } from "@tokenring-ai/filesystem/FileMatchResource";
import { ShellCommandTestingResourceOptions } from "@tokenring-ai/testing/ShellCommandTestingResource";

export type CodeBaseResourceConfig =
	| (FileMatchResourceConfig & { type: "fileTree" })
	| (FileMatchResourceConfig & { type: "repoMap" })
	| (FileMatchResourceConfig & { type: "wholeFile" });

export type RepoMapResourceConfig = FileMatchResourceConfig & {
	type: "repoMap";
};

export type TestingResourceConfig = ShellCommandTestingResourceOptions & {
	type: "shell-testing";
};

export type FileSystemProviderConfig = BrowserFileSystem & { type: "browser" };

export interface WebTerminalConfig {
	defaults: {
		agent: string;
		tools?: string[];
		model: string;
	};
	agents: Record<string, AgentConfig>;
	models: Record<string, ModelProviderConfig>;
	filesystem?: {
		default?: {
			provider?: string;
			selectedFiles?: string[];
		};
		providers: Record<string, FileSystemProviderConfig>;
	};
	codebase?: {
		default?: {
			resources?: string[];
		};
		resources: Record<string, CodeBaseResourceConfig>;
	};
	testing?: {
		default?: {
			resources?: string[];
		};
		resources: Record<string, TestingResourceConfig>;
	};
}
