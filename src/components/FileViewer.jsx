import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Save, AlertTriangle, Info, Trash2, Edit2 } from 'lucide-react';
import { useRegistry } from "../context/RegistryProvider";
import { useTheme } from '../context/ThemeProvider';

const ActionButton = ({ onClick, children, disabled, className = '', icon: Icon }) => (
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

/**
 * @param {{filePath: string, onFileDeleted?: () => void, onFileRenamed?: (newPath: string) => void}} props
 * @returns {JSX.Element}
 */
export default function FileViewer({ filePath, onFileDeleted, onFileRenamed }) {
  const registry = useRegistry();
  const { theme } = useTheme();

  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        if (!registry) throw new Error('Registry not found');
        const FileSystem = globalThis.FileSystemService;
        const fsService = registry.getFirstServiceByType(FileSystem);
        if (!fsService) throw new Error('FileSystem service not found');
        const data = await fsService.getFile(filePath);
        setContent(data);
        setDirty(false);
      } catch (e) {
        setError(e.message);
      }
    }
    load();
  }, [filePath, registry]);

  const handleSave = async () => {
    try {
      const FileSystem = globalThis.FileSystemService;
      const fsService = registry.getFirstServiceByType(FileSystem);
      await fsService.writeFile(filePath, content);
      setDirty(false);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete '${filePath}'?`)) return;
    try {
      const FileSystem = globalThis.FileSystemService;
      const fsService = registry.getFirstServiceByType(FileSystem);
      await fsService.deleteFile(filePath);
      if (onFileDeleted) onFileDeleted();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleRename = async () => {
    const name = filePath.split('/').pop();
    const newName = window.prompt('Enter new name:', name);
    if (!newName || newName === name) return;
    const newPath = filePath.split('/').slice(0, -1).concat(newName).join('/');
    try {
      const FileSystem = globalThis.FileSystemService;
      const fsService = registry.getFirstServiceByType(FileSystem);
      await fsService.renameFile(filePath, newPath);
      if (onFileRenamed) onFileRenamed(newPath);
    } catch (e) {
      setError(e.message);
    }
  };

  const getLanguageFromPath = (path) => {
    const extension = path.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'json':
        return 'json';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'py':
        return 'python';
      case 'md':
        return 'markdown';
      case 'java':
        return 'java';
      case 'c':
      case 'h':
        return 'c';
      case 'cpp':
      case 'hpp':
        return 'cpp';
      case 'cs':
        return 'csharp';
      case 'go':
        return 'go';
      case 'php':
        return 'php';
      case 'rb':
        return 'ruby';
      case 'rs':
        return 'rust';
      case 'swift':
        return 'swift';
      case 'kt':
        return 'kotlin';
      case 'yaml':
      case 'yml':
        return 'yaml';
      default:
        return 'plaintext';
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
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={filePath}>
          {filePath.split('/').pop()}
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
      <div className="flex-grow relative">
        <Editor
          height="100%"
          language={language}
          value={content || ''}
          onChange={(value) => { setContent(value); setDirty(true); }}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          options={{
            automaticLayout: true,
            minimap: { enabled: true, scale: 1 },
            wordWrap: 'on',
            fontSize: 13,
            renderWhitespace: 'boundary',
            cursorStyle: 'line',
          }}
        />
      </div>
    </div>
  );
}
