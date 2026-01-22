import {Agent} from "@tokenring-ai/agent";
import { FileSystemService } from "@tokenring-ai/filesystem";
import createIgnoreFilter from "@tokenring-ai/filesystem/util/createIgnoreFilter";
import {
	ChevronDown,
	ChevronRight,
	Download,
	Edit2,
	FileText,
	Folder as FolderIcon,
	FolderOpen,
	Trash2,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../context/TokenRingAppProvider.js";

type TreeNode = {
	__children__: Record<string, TreeNode>;
	__full__: string;
	__isFile__: boolean;
	__name__?: string;
};

function buildTree(paths: string[]): Record<string, TreeNode> {
	const root: Record<string, TreeNode> = {};
	for (const p of paths) {
		const parts = p.split("/");
		let current: Record<string, TreeNode> = root;
		parts.forEach((part: string, idx: number) => {
			if (!current[part]) {
				current[part] = {
					__children__: {},
					__full__: parts.slice(0, idx + 1).join("/"),
					__isFile__: idx === parts.length - 1,
				};
			}
			current = current[part].__children__;
		});
	}
	return root;
}

type TreeNodeProps = {
  agent: Agent;
	node: TreeNode;
	depth: number;
	onFileOpen: (filePath: string) => void;
	refreshTree: () => Promise<void>;
	setError: (error: string | null) => void;
};

function TreeNodeComponent({
	agent,
	node,
	depth,
	onFileOpen,
	refreshTree,
	setError,
}: TreeNodeProps) {
	const team = useApp();
	const [open, setOpen] = useState(depth <= 0);
	const isFile = node.__isFile__;
	const name = node.__name__;
	const fullPath = node.__full__;
	const childrenKeys = Object.keys(node.__children__ || {});
	const children = childrenKeys.map((k) => ({
		...node.__children__[k],
		__name__: k,
	}));

	// Handle download
	const handleDownload = async (e: React.MouseEvent) => {
		e.stopPropagation();
		try {
			if (!team) return;
			const fsService = team.services.requireItemByType(FileSystemService);
			const content = await fsService.readTextFile(fullPath, agent);
			const blob = new Blob([content || ""], {
				type: "application/octet-stream",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = name || "download";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (err) {
			setError && setError((err as Error).message);
		}
	};

	// Handle delete
	const handleDelete = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!window.confirm(`Are you sure you want to delete '${fullPath}'?`))
			return;
		try {
			if (!team) return;
			const fsService = team.services.requireItemByType(FileSystemService);
			await fsService.deleteFile(fullPath, agent);
			await refreshTree();
		} catch (err) {
			setError && setError((err as Error).message);
		}
	};

	// Handle rename
	const handleRename = async (e: React.MouseEvent) => {
		e.stopPropagation();
		const newName = window.prompt("Enter new name:", name);
		if (!newName || newName === name) return;
		const newPath = fullPath.split("/").slice(0, -1).concat(newName).join("/");
		try {
			if (!team) return;
			const fsService = team.services.requireItemByType(FileSystemService);
			const content = await fsService.readTextFile(fullPath, agent);
			await fsService.writeFile(newPath, content || "", agent);
			await fsService.deleteFile(fullPath, agent);
			await refreshTree();
		} catch (err) {
			setError && setError((err as Error).message);
		}
	};

	return (
		<div className="text-sm">
			<div
				className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 cursor-pointer group"
				onClick={() => {
					if (isFile) {
						onFileOpen(fullPath);
					} else {
						setOpen((o) => !o);
					}
				}}
			>
				{isFile ? (
					<>
						<FileText
							size={16}
							className="shrink-0 text-blue-500 dark:text-blue-400"
						/>
						<span className="grow truncate">{name}</span>
						<button title="Download" onClick={handleDownload}>
							<Download
								size={16}
								className="shrink-0 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 ml-1"
							/>
						</button>
						<button title="Rename" onClick={handleRename}>
							<Edit2
								size={14}
								className="shrink-0 text-gray-500 hover:text-blue-600 ml-1"
							/>
						</button>
						<button title="Delete" onClick={handleDelete}>
							<Trash2
								size={14}
								className="shrink-0 text-red-500 hover:text-red-700 ml-1"
							/>
						</button>
					</>
				) : (
					<>
						{open ? (
							<ChevronDown
								size={16}
								className="shrink-0 text-gray-500 dark:text-gray-400"
							/>
						) : (
							<ChevronRight
								size={16}
								className="shrink-0 text-gray-500 dark:text-gray-400"
							/>
						)}
						{open ? (
							<FolderOpen
								size={16}
								className="shrink-0 text-yellow-500 dark:text-yellow-400"
							/>
						) : (
							<FolderIcon
								size={16}
								className="shrink-0 text-yellow-500 dark:text-yellow-400"
							/>
						)}
						<span className="grow truncate">{name}</span>
						<button title="Rename" onClick={handleRename}>
							<Edit2
								size={14}
								className="shrink-0 text-gray-500 hover:text-blue-600 ml-1"
							/>
						</button>
						<button title="Delete" onClick={handleDelete}>
							<Trash2
								size={14}
								className="shrink-0 text-red-500 hover:text-red-700 ml-1"
							/>
						</button>
					</>
				)}
			</div>
			{!isFile && open && (
				<div className="pl-4 border-l border-gray-200 dark:border-gray-700">
					{children.map((child) => (
						<TreeNodeComponent
              agent={agent}
							key={child.__full__}
							node={child}
							depth={depth + 1}
							onFileOpen={onFileOpen}
							refreshTree={refreshTree}
							setError={setError}
						/>
					))}
				</div>
			)}
		</div>
	);
}

/**
 * @param {{onFileOpen: (filePath:string)=>void}} props
 */
export default function FileTree({
	onFileOpen,
  agent
}: {
	onFileOpen: (filePath: string) => void;
  agent: Agent;
}) {
	const team = useApp();
	const [treeData, setTreeData] = useState<Record<string, TreeNode> | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const refreshTree = useCallback(async () => {
		try {
			setError(null);
			if (!team) return;
			const fsService = team.services.requireItemByType(FileSystemService);
			const ignoreFilter = await createIgnoreFilter(fsService.requireActiveFileSystem(agent));
			const paths: string[] = [];
			for await (const p of fsService.getDirectoryTree("", {
				ignoreFilter,
				recursive: true,
			}, agent)) {
				paths.push(p);
			}
			setTreeData(buildTree(paths));
		} catch (e) {
			setError((e as Error).message);
		}
	}, [team]);

	useEffect(() => {
		refreshTree();
	}, [refreshTree]);

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		setUploading(true);
		setError(null);
		try {
			if (!team) return;
			const fsService = team.services.requireItemByType(FileSystemService);
			for (const file of files) {
				const content = await file.text();
				await fsService.writeFile(file.name, content, agent);
			}
			await refreshTree();
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	if (error) {
		return (
			<div className="p-3 m-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md dark:bg-red-800 dark:text-red-200 dark:border-red-600">
				<strong>Error:</strong> {error}
			</div>
		);
	}

	if (!treeData && !error) {
		return (
			<div className="p-3 m-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600">
				Loading file tree...
			</div>
		);
	}

	const rootNodes = treeData
		? Object.keys(treeData).map((k) => ({
				...treeData[k],
				__name__: k,
			}))
		: [];

	return (
		<>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-gray-400 text-sm font-semibold px-2">
					FILE EXPLORER
				</h2>
				<div className="flex space-x-2">
					<button
						onClick={() => refreshTree()}
						className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
					>
						<svg
							className="w-5 h-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
					</button>
					<button
						onClick={async () => {
							const fileName = prompt("Enter new file name:");
							if (!fileName || !team) return;
							try {
								const fsService =
									team.services.requireItemByType(FileSystemService);
								await fsService.writeFile(fileName, "", agent);
								await refreshTree();
							} catch (err) {
								setError((err as Error).message);
							}
						}}
						className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
					>
						<svg
							className="w-5 h-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
					</button>
					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						multiple
						onChange={handleFileChange}
					/>
				</div>
			</div>
			<div className="space-y-1">
				{rootNodes.map((n) => (
					<TreeNodeComponent
            agent={agent}
						key={n.__full__}
						node={n}
						depth={0}
						onFileOpen={onFileOpen}
						refreshTree={refreshTree}
						setError={setError}
					/>
				))}
			</div>
		</>
	);
}
