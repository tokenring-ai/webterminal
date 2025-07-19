import React, { useEffect, useState, useCallback, useRef } from "react";
import {
	ChevronRight,
	ChevronDown,
	FileText,
	Folder as FolderIcon,
	FolderOpen,
	Upload,
	Download,
	Trash2,
	Edit2,
} from "lucide-react";
import clsx from "clsx";
import { useRegistry } from "../context/RegistryProvider";
import { FileSystemService } from "@token-ring/filesystem";

/**
 * Recursively builds a nested tree structure from an array of file paths.
 * @param {string[]} paths
 */
function buildTree(paths) {
	const root = {};
	for (const p of paths) {
		const parts = p.split("/");
		let current = root;
		parts.forEach((part, idx) => {
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

function TreeNode({ node, depth, onFileOpen, refreshTree, setError }) {
	const registry = useRegistry();
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
	const handleDownload = async (e) => {
		e.stopPropagation();
		try {
			const fsService = registry.getFirstServiceByType(FileSystemService);
			const content = await fsService.getFile(fullPath);
			const blob = new Blob([content], { type: "application/octet-stream" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = name;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (err) {
			setError && setError(err.message);
		}
	};

	// Handle delete
	const handleDelete = async (e) => {
		e.stopPropagation();
		if (!window.confirm(`Are you sure you want to delete '${fullPath}'?`))
			return;
		try {
			const fsService = registry.getFirstServiceByType(FileSystemService);
			await fsService.deleteFile(fullPath);
			await refreshTree();
		} catch (err) {
			setError && setError(err.message);
		}
	};

	// Handle rename
	const handleRename = async (e) => {
		e.stopPropagation();
		const newName = window.prompt("Enter new name:", name);
		if (!newName || newName === name) return;
		const newPath = fullPath.split("/").slice(0, -1).concat(newName).join("/");
		try {
			const fsService = registry.getFirstServiceByType(FileSystemService);
			await fsService.renameFile(fullPath, newPath);
			await refreshTree();
		} catch (err) {
			setError && setError(err.message);
		}
	};

	return (
		<div className="text-sm">
			<div
				className={clsx(
					"flex items-center space-x-2 py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer select-none",
					{ "font-semibold": !isFile && open },
				)}
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
						<span className="flex-grow truncate">{name}</span>
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
						<span className="flex-grow truncate">{name}</span>
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
						<TreeNode
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
export default function FileTree({ onFileOpen }) {
	const registry = useRegistry();
	const [treeData, setTreeData] = useState(null);
	const [error, setError] = useState(null);
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef(null);

	const refreshTree = useCallback(async () => {
		try {
			setError(null);
			const fsService = registry.getFirstServiceByType(FileSystemService);
			if (!fsService) throw new Error("FileSystem service not found");
			const ig = await fsService.createIgnoreFilter();
			const paths = [];
			for await (const p of fsService.getDirectoryTree("", {
				ig,
				recursive: true,
			})) {
				paths.push(p);
			}
			setTreeData(buildTree(paths));
		} catch (e) {
			setError(e.message);
		}
	}, [registry]);

	useEffect(() => {
		refreshTree();
	}, [refreshTree]);

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		setUploading(true);
		setError(null);
		try {
			const fsService = registry.getFirstServiceByType(FileSystemService);
			if (!fsService) throw new Error("FileSystem service not found");
			for (const file of files) {
				const content = await file.arrayBuffer();
				await fsService.writeFile(file.name, new Uint8Array(content));
			}
			await refreshTree();
		} catch (err) {
			setError(err.message);
		} finally {
			setUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = null;
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

	const rootNodes = Object.keys(treeData).map((k) => ({
		...treeData[k],
		__name__: k,
	}));

	return (
		<div className="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
			<div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 gap-2">
				<span className="text-md font-semibold">File Explorer</span>
				<div className="flex gap-2">
					<button
						onClick={async () => {
							const fileName = prompt(
								"Enter new file name (with path if needed):",
							);
							if (!fileName) return;
							try {
								const fsService =
									registry.getFirstServiceByType(FileSystemService);
								await fsService.writeFile(fileName, "");
								await refreshTree();
							} catch (err) {
								setError(err.message);
							}
						}}
						className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-500 hover:bg-green-600 text-white"
					>
						+ File
					</button>
					<button
						onClick={async () => {
							const folderName = prompt(
								"Enter new folder name (with path if needed):",
							);
							if (!folderName) return;
							try {
								const fsService =
									registry.getFirstServiceByType(FileSystemService);
								await fsService.mkdir(folderName); // Assumes mkdir is available
								await refreshTree();
							} catch (err) {
								setError(err.message);
							}
						}}
						className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
					>
						+ Folder
					</button>
					<button
						onClick={handleUploadClick}
						disabled={uploading}
						className={clsx(
							"flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition-colors",
							"bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700",
							{ "opacity-50 cursor-not-allowed": uploading },
						)}
					>
						{uploading ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
								Uploading...
							</>
						) : (
							<>
								<Upload size={16} /> Upload Files
							</>
						)}
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
			<div className="p-2 overflow-auto flex-1 space-y-0.5">
				{rootNodes.map((n) => (
					<TreeNode
						key={n.__full__}
						node={n}
						depth={0}
						onFileOpen={onFileOpen}
						refreshTree={refreshTree}
						setError={setError}
					/>
				))}
			</div>
		</div>
	);
}
