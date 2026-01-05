import { Editor } from "@monaco-editor/react";
import {Agent} from "@tokenring-ai/agent";
import { FileSystemService } from "@tokenring-ai/filesystem";
import { AlertTriangle, Edit2, Save, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useApp } from "../context/TokenRingAppProvider.tsx";
import { useTheme } from "../context/ThemeProvider.tsx";

const ActionButton = ({
	onClick,
	children,
	disabled = false,
	className = "",
	icon: Icon,
}: {
	onClick: () => void;
	children: React.ReactNode;
	disabled?: boolean;
	className?: string;
	icon: React.ComponentType<{ size: number }>;
}) => (
	<button
		onClick={onClick}
		disabled={disabled}
		className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-sm transition-colors
                bg-blue-600 hover:bg-blue-700 text-white
                dark:bg-blue-500 dark:hover:bg-blue-600
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                ${className}`}
	>
		{Icon && <Icon size={16} />}
		{children}
	</button>
);

export default function FileViewer({
  agent,
	filePath,
	onFileDeleted,
	onFileRenamed,
}: {
  agent: Agent;
	filePath: string;
	onFileDeleted?: () => void;
	onFileRenamed?: (newPath: string) => void;
}) {
	const team = useApp();
	const { theme } = useTheme();

	const [content, setContent] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [dirty, setDirty] = useState(false);

	useEffect(() => {
		setContent(null);
		setError(null);
		setDirty(false);

		async function load() {
			try {
				if (!team) throw new Error("Team not found");
				const fsService = team.services.requireItemByType(FileSystemService);
				const data = await fsService.readTextFile(filePath, agent);
				setContent(data);
			} catch (e) {
				setError((e as Error).message);
			}
		}
		load();
	}, [filePath, team]);

	const handleSave = async () => {
		try {
			if (!team) return;
			const fsService = team.services.requireItemByType(FileSystemService);
			await fsService.writeFile(filePath, content || "", agent);
			setDirty(false);
		} catch (e) {
			setError((e as Error).message);
		}
	};

	const handleDelete = async () => {
		if (!window.confirm(`Are you sure you want to delete '${filePath}'?`))
			return;
		try {
			if (!team) return;
			const fsService = team.services.requireItemByType(FileSystemService);
			await fsService.deleteFile(filePath, agent);
			if (onFileDeleted) onFileDeleted();
		} catch (e) {
			setError((e as Error).message);
		}
	};

	const handleRename = async () => {
		const name = filePath.split("/").pop();
		const newName = window.prompt("Enter new name:", name);
		if (!newName || newName === name) return;
		const newPath = filePath.split("/").slice(0, -1).concat(newName).join("/");
		try {
			if (!team) return;
			const fsService = team.services.getItemByType(FileSystemService);
			if (!fsService) throw new Error("FileSystem service not found");
			const fileContent = await fsService.readTextFile(filePath, agent);
			await fsService.writeFile(newPath, fileContent || "", agent);
			await fsService.deleteFile(filePath, agent);
			if (onFileRenamed) onFileRenamed(newPath);
		} catch (e) {
			setError((e as Error).message);
		}
	};

	const getLanguageFromPath = (path: string) => {
		const extension = path.split(".").pop()?.toLowerCase();
		switch (extension) {
			case "js":
			case "jsx":
				return "javascript";
			case "ts":
			case "tsx":
				return "typescript";
			case "json":
				return "json";
			case "css":
				return "css";
			case "html":
				return "html";
			case "py":
				return "python";
			case "md":
				return "markdown";
			case "java":
				return "java";
			case "c":
			case "h":
				return "c";
			case "cpp":
			case "hpp":
				return "cpp";
			case "cs":
				return "csharp";
			case "go":
				return "go";
			case "php":
				return "php";
			case "rb":
				return "ruby";
			case "rs":
				return "rust";
			case "swift":
				return "swift";
			case "kt":
				return "kotlin";
			case "yaml":
			case "yml":
				return "yaml";
			default:
				return "plaintext";
		}
	};
	const language = getLanguageFromPath(filePath);

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200">
				<AlertTriangle size={48} className="mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error Loading File</h3>
				<p className="text-sm text-center">{error}</p>
				<p className="text-xs mt-2 text-center">File: {filePath}</p>
			</div>
		);
	}
	if (content === null && !error) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-4 text-gray-500 dark:text-gray-400">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
				<p className="text-sm">Loading {filePath}...</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-white dark:bg-gray-900">
			<div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
				<span
					className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate"
					title={filePath}
				>
					{filePath.split("/").pop()}
				</span>
				<div className="flex gap-2">
					<ActionButton onClick={handleRename} icon={Edit2}>
						Rename
					</ActionButton>
					<ActionButton onClick={handleDelete} icon={Trash2}>
						Delete
					</ActionButton>
					<ActionButton onClick={handleSave} disabled={!dirty} icon={Save}>
						Save
					</ActionButton>
				</div>
			</div>
			<div className="grow relative">
				<Editor
					height="100%"
					language={language}
					value={content || ""}
					onChange={(value: string | undefined) => {
						setContent(value || "");
						setDirty(true);
					}}
					theme={theme === "dark" ? "vs-dark" : "vs"}
					options={{
						automaticLayout: true,
						minimap: { enabled: true, scale: 1 },
						wordWrap: "on",
						fontSize: 13,
						renderWhitespace: "boundary",
						cursorStyle: "line",
					}}
				/>
			</div>
		</div>
	);
}
