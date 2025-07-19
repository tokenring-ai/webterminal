import React from "react";
import { useTheme } from "../context/ThemeProvider";
import useConfigurationStore from "../hooks/useConfigurationStore";
import { Sun, Moon, PlusCircle, Trash2 } from "lucide-react"; // Added icons

// Helper component for section styling
const SettingsSection = ({ title, children }) => (
	<section className="mb-8 p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
		<h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2 dark:border-gray-700">
			{title}
		</h4>
		<div className="space-y-4">{children}</div>
	</section>
);

// Helper for input fields
const StyledInput = (props) => (
	<input
		{...props}
		className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${props.className || ""}`}
	/>
);

const StyledSelect = (props) => (
	<select
		{...props}
		className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${props.className || ""}`}
	/>
);

const StyledTextArea = (props) => (
	<textarea
		{...props}
		className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${props.className || ""}`}
	/>
);

const ActionButton = ({
	onClick,
	children,
	variant = "primary",
	size = "sm",
	className = "",
}) => {
	const baseStyle =
		"px-3 py-1.5 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800";
	const sizeStyles = {
		sm: "text-xs",
		md: "text-sm",
	};
	const variantStyles = {
		primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
		secondary:
			"bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 focus:ring-gray-400",
		danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
		success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500",
		ghost:
			"hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300",
	};

	return (
		<button
			onClick={onClick}
			className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
		>
			{children}
		</button>
	);
};

/**
 * SettingsPanel – configure coder settings from coderConfig.js
 * @returns {JSX.Element}
 */
export default function SettingsPanel() {
	const { data: session } = {}; //useSession();
	const [profile, setProfile] = React.useState({
		name: session?.user?.name || "",
		email: session?.user?.email || "",
	});

	const saveProfile = async () => {
		try {
			// TODO: call your profile update API here
			console.log("Updated profile:", profile);
		} catch (e) {
			console.error(e);
		}
	};

	const { theme, setTheme } = useTheme();
	const { config, setConfigurationValue, getConfigurationValue } =
		useConfigurationStore();

	// Handlers for defaults
	const handleDefaultChange = (field) => (e) => {
		setConfigurationValue(`defaults.${field}`, e.target.value);
	};

	const toggleDefaultResource = (resKey) => () => {
		const currentResources = getConfigurationValue("defaults.resources") || [];
		const newResources = currentResources.includes(resKey)
			? currentResources.filter((r) => r !== resKey)
			: [...currentResources, resKey];
		setConfigurationValue("defaults.resources", newResources);
	};

	const updateDefaultFile = (indexToUpdate) => (e) => {
		const currentFiles = getConfigurationValue("defaults.selectedFiles") || [];
		const newFiles = currentFiles.map((file, i) =>
			i === indexToUpdate ? e.target.value : file,
		);
		setConfigurationValue("defaults.selectedFiles", newFiles);
	};

	const addDefaultFile = () => {
		const currentFiles = getConfigurationValue("defaults.selectedFiles") || [];
		setConfigurationValue("defaults.selectedFiles", [...currentFiles, ""]);
	};

	const removeDefaultFile = (indexToRemove) => () => {
		const currentFiles = getConfigurationValue("defaults.selectedFiles") || [];
		setConfigurationValue(
			"defaults.selectedFiles",
			currentFiles.filter((_, i) => i !== indexToRemove),
		);
	};

	const handleDefaultToolChange = (indexToUpdate, newValue) => {
		const currentTools = getConfigurationValue("defaults.tools") || [];
		const newTools = currentTools.map((tool, i) =>
			i === indexToUpdate ? newValue : tool,
		);
		setConfigurationValue("defaults.tools", newTools);
	};

	const handleAddDefaultTool = () => {
		const currentTools = getConfigurationValue("defaults.tools") || [];
		setConfigurationValue("defaults.tools", [...currentTools, ""]); // Add an empty string to be filled
	};

	const handleRemoveDefaultTool = (indexToRemove) => {
		const currentTools = getConfigurationValue("defaults.tools") || [];
		setConfigurationValue(
			"defaults.tools",
			currentTools.filter((_, i) => i !== indexToRemove),
		);
	};

	// Handlers for models
	const updateModelField = (modelKey, field) => (e) => {
		setConfigurationValue(`models.${modelKey}.${field}`, e.target.value);
	};

	const handleAddModelConfiguration = () => {
		const newModelKey = window.prompt(
			"Enter a unique key for the new model configuration (e.g., 'MyGroqLlama'):",
		);
		if (newModelKey && newModelKey.trim() !== "") {
			const currentModels = getConfigurationValue("models") || {};
			if (currentModels.hasOwnProperty(newModelKey)) {
				alert(`Model configuration with key '${newModelKey}' already exists.`);
				return;
			}
			const newModelDefaults = {
				provider: "", // User should fill this, e.g., 'openai', 'anthropic', 'ollama'
				model: "", // User should fill this, e.g., 'llama3', 'claude-3-opus-20240229'
				apiKey: "",
				baseURL: "",
				// Add any other common/default fields for a model config
			};
			setConfigurationValue(`models.${newModelKey}`, newModelDefaults);
		}
	};

	const handleRemoveModelConfiguration = (modelKeyToRemove) => {
		if (
			window.confirm(
				`Are you sure you want to remove the model configuration '${modelKeyToRemove}'?`,
			)
		) {
			const currentModels = getConfigurationValue("models") || {};
			const { [modelKeyToRemove]: _, ...remainingModels } = currentModels;
			setConfigurationValue("models", remainingModels);
		}
	};

	// Handlers for Personas
	const handlePersonaFieldChange = (personaKey, field, value) => {
		const path = `personas.${personaKey}.${field}`;
		if (field === "temperature" || field === "top_p") {
			const numValue = parseFloat(value);
			if (!isNaN(numValue)) {
				setConfigurationValue(path, numValue);
			}
		} else {
			setConfigurationValue(path, value);
		}
	};

	const handleAddPersona = () => {
		const newPersonaKey = window.prompt(
			"Enter a name for the new persona (e.g., 'helpful-assistant'):",
		);
		if (newPersonaKey && newPersonaKey.trim() !== "") {
			const currentPersonas = getConfigurationValue("personas") || {};
			if (currentPersonas.hasOwnProperty(newPersonaKey)) {
				alert(`Persona with key '${newPersonaKey}' already exists.`);
				return;
			}
			const newPersonaDefaults = {
				instructions: "Default instructions for new persona.",
				model: config?.defaults?.model || "default-model", // Use global default model
				temperature: 0.7,
				top_p: 1.0,
			};
			setConfigurationValue(`personas.${newPersonaKey}`, newPersonaDefaults);
		}
	};

	const handleRemovePersona = (personaKey) => {
		if (
			window.confirm(
				`Are you sure you want to remove the persona '${personaKey}'?`,
			)
		) {
			const currentPersonas = getConfigurationValue("personas") || {};
			const { [personaKey]: _, ...remainingPersonas } = currentPersonas; // Destructure to omit
			setConfigurationValue("personas", remainingPersonas);
		}
	};

	// Handlers for indexedFiles
	const updateIndexed = (indexToUpdate) => (e) => {
		const currentIndexedFiles = getConfigurationValue("indexedFiles") || [];
		const newIndexedFiles = currentIndexedFiles.map((item, i) =>
			i === indexToUpdate ? { ...item, path: e.target.value } : item,
		);
		setConfigurationValue("indexedFiles", newIndexedFiles);
	};

	const addIndexed = () => {
		const currentIndexedFiles = getConfigurationValue("indexedFiles") || [];
		setConfigurationValue("indexedFiles", [
			...currentIndexedFiles,
			{ path: "" },
		]);
	};

	const removeIndexed = (indexToRemove) => () => {
		const currentIndexedFiles = getConfigurationValue("indexedFiles") || [];
		setConfigurationValue(
			"indexedFiles",
			currentIndexedFiles.filter((_, i) => i !== indexToRemove),
		);
	};

	// Handlers for watchedFiles
	const updateWatched = (indexToUpdate, field) => (e) => {
		const currentWatchedFiles = getConfigurationValue("watchedFiles") || [];
		const newWatchedFiles = currentWatchedFiles.map((item, i) =>
			i === indexToUpdate ? { ...item, [field]: e.target.value } : item,
		);
		setConfigurationValue("watchedFiles", newWatchedFiles);
	};

	const addWatched = () => {
		const currentWatchedFiles = getConfigurationValue("watchedFiles") || [];
		setConfigurationValue("watchedFiles", [
			...currentWatchedFiles,
			{ path: "", include: "" },
		]);
	};

	const removeWatched = (indexToRemove) => () => {
		const currentWatchedFiles = getConfigurationValue("watchedFiles") || [];
		setConfigurationValue(
			"watchedFiles",
			currentWatchedFiles.filter((_, i) => i !== indexToRemove),
		);
	};

	// Handlers for resources
	const handleAddResourceGroup = () => {
		const newResourceKey = window.prompt(
			"Enter a unique key for the new resource group (e.g., 'projectSrc'):",
		);
		if (newResourceKey && newResourceKey.trim() !== "") {
			const currentResources = getConfigurationValue("resources") || {};
			if (currentResources.hasOwnProperty(newResourceKey)) {
				alert(`Resource group with key '${newResourceKey}' already exists.`);
				return;
			}
			const newResourceGroupDefaults = {
				type: "fileTree", // Default type
				items: [],
			};
			setConfigurationValue(
				`resources.${newResourceKey}`,
				newResourceGroupDefaults,
			);
		}
	};

	const handleRemoveResourceGroup = (resourceKeyToRemove) => {
		if (
			window.confirm(
				`Are you sure you want to remove the resource group '${resourceKeyToRemove}' and all its items?`,
			)
		) {
			const currentResources = getConfigurationValue("resources") || {};
			const { [resourceKeyToRemove]: _, ...remainingResources } =
				currentResources;
			setConfigurationValue("resources", remainingResources);
		}
	};

	const handleResourceGroupTypeChange = (resourceKey, newType) => {
		setConfigurationValue(`resources.${resourceKey}.type`, newType);
	};

	const handleResourceItemChange = (resourceKey, itemIndex, field, value) => {
		const itemsPath = `resources.${resourceKey}.items`;
		const currentItems = getConfigurationValue(itemsPath) || [];
		const newItems = currentItems.map((item, i) =>
			i === itemIndex ? { ...item, [field]: value } : item,
		);
		setConfigurationValue(itemsPath, newItems);
	};

	const handleAddResourceItem = (resourceKey) => {
		const itemsPath = `resources.${resourceKey}.items`;
		const currentItems = getConfigurationValue(itemsPath) || [];
		setConfigurationValue(itemsPath, [
			...currentItems,
			{ path: "", include: "" },
		]);
	};

	const handleRemoveResourceItem = (resourceKey, itemIndexToRemove) => {
		const itemsPath = `resources.${resourceKey}.items`;
		const currentItems = getConfigurationValue(itemsPath) || [];
		const newItems = currentItems.filter((_, i) => i !== itemIndexToRemove);
		setConfigurationValue(itemsPath, newItems);
	};

	// Save action (for now, log)
	const saveConfig = () => {
		// Config is now live in the store, this function can be for other side effects if needed
		console.log("Current config from store:", config);
	};

	return (
		<div className="p-4 space-y-6 overflow-auto text-sm bg-gray-50 dark:bg-gray-900 h-full">
			<SettingsSection title="Appearance">
				<div className="flex items-center justify-between">
					<label
						htmlFor="theme-toggle"
						className="text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Theme
					</label>
					<button
						id="theme-toggle"
						onClick={() => setTheme(theme === "light" ? "dark" : "light")}
						className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
						aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
					>
						{theme === "light" ? (
							<Moon size={20} className="text-gray-600" />
						) : (
							<Sun size={20} className="text-yellow-400" />
						)}
					</button>
				</div>
			</SettingsSection>

			{/* Profile Section */}
			<SettingsSection title="Profile">
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Name
					</label>
					<StyledInput
						type="text"
						value={profile.name}
						onChange={(e) =>
							setProfile((prev) => ({ ...prev, name: e.target.value }))
						}
						placeholder="Your Name"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Email
					</label>
					<StyledInput
						type="email"
						value={profile.email}
						disabled
						className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
						placeholder="your.email@example.com"
					/>
				</div>
				<ActionButton onClick={saveProfile} variant="success" size="md">
					Save Profile
				</ActionButton>
			</SettingsSection>

			{/* Defaults Section */}
			<SettingsSection title="Defaults">
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Model
					</label>
					<StyledInput
						type="text"
						value={config?.defaults?.model || ""}
						onChange={handleDefaultChange("model")}
						placeholder="e.g., gpt-4-turbo"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Default Persona
					</label>
					<StyledSelect
						value={config?.defaults?.persona || ""}
						onChange={handleDefaultChange("persona")}
					>
						<option value="">-- Select Default Persona --</option>
						{Object.keys(config?.personas ?? {}).map((personaKey) => (
							<option key={personaKey} value={personaKey}>
								{personaKey}
							</option>
						))}
					</StyledSelect>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Default Resources
					</label>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 border dark:border-gray-700 rounded-md">
						{Object.keys(config?.resources ?? {}).map((resKey) => (
							<label
								key={resKey}
								className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
							>
								<input
									type="checkbox"
									className="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-500 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-blue-500"
									checked={
										config?.defaults?.resources?.includes(resKey) || false
									}
									onChange={toggleDefaultResource(resKey)}
								/>
								<span>{resKey}</span>
							</label>
						))}
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Default Selected Files
					</label>
					<div className="space-y-2">
						{config?.defaults?.selectedFiles?.map((f, i) => (
							<div key={i} className="flex items-center space-x-2">
								<StyledInput
									type="text"
									value={f}
									onChange={updateDefaultFile(i)}
									placeholder="path/to/default/file.js"
								/>
								<ActionButton
									onClick={removeDefaultFile(i)}
									variant="danger"
									size="sm"
									className="p-1.5"
								>
									<Trash2 size={14} />
								</ActionButton>
							</div>
						))}
						<ActionButton
							onClick={addDefaultFile}
							variant="secondary"
							size="sm"
							className="flex items-center gap-1"
						>
							<PlusCircle size={14} /> Add File
						</ActionButton>
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Default Tools
					</label>
					<div className="space-y-2">
						{(config?.defaults?.tools || []).map((toolName, index) => (
							<div key={index} className="flex items-center space-x-2">
								<StyledInput
									type="text"
									value={toolName}
									onChange={(e) =>
										handleDefaultToolChange(index, e.target.value)
									}
									placeholder="Enter tool name (e.g., readFile)"
								/>
								<ActionButton
									onClick={() => handleRemoveDefaultTool(index)}
									variant="danger"
									size="sm"
									className="p-1.5"
								>
									<Trash2 size={14} />
								</ActionButton>
							</div>
						))}
						<ActionButton
							onClick={handleAddDefaultTool}
							variant="secondary"
							size="sm"
							className="flex items-center gap-1"
						>
							<PlusCircle size={14} /> Add Tool
						</ActionButton>
					</div>
				</div>
			</SettingsSection>

			{/* Models Section */}
			<SettingsSection title="Model Configurations">
				<div className="space-y-4">
					{Object.entries(config?.models ?? {}).map(
						([modelKey, modelConfig]) => (
							<div
								key={modelKey}
								className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-850 shadow"
							>
								<div className="flex justify-between items-center mb-3">
									<h5 className="font-medium text-md text-gray-700 dark:text-gray-300">
										{modelKey}
									</h5>
									<ActionButton
										onClick={() => handleRemoveModelConfiguration(modelKey)}
										variant="danger"
										size="sm"
									>
										Remove Model
									</ActionButton>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{Object.entries(modelConfig).map(([field, value]) => (
										<div key={field}>
											<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
												{field}
											</label>
											<StyledInput
												type={
													field.toLowerCase().includes("key")
														? "password"
														: "text"
												}
												value={value || ""}
												onChange={updateModelField(modelKey, field)}
												placeholder={`Enter ${field}`}
											/>
										</div>
									))}
								</div>
							</div>
						),
					)}
					<ActionButton
						onClick={handleAddModelConfiguration}
						variant="success"
						size="md"
						className="flex items-center gap-1"
					>
						<PlusCircle size={16} /> Add Model Configuration
					</ActionButton>
				</div>
			</SettingsSection>

			{/* Personas Section */}
			<SettingsSection title="Personas">
				<div className="space-y-4">
					{Object.entries(config?.personas ?? {}).map(
						([personaKey, personaConfig]) => (
							<div
								key={personaKey}
								className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-850 shadow"
							>
								<div className="flex justify-between items-center mb-3">
									<h5 className="font-medium text-md text-gray-700 dark:text-gray-300">
										{personaKey}
									</h5>
									<ActionButton
										onClick={() => handleRemovePersona(personaKey)}
										variant="danger"
										size="sm"
									>
										Remove Persona
									</ActionButton>
								</div>
								<div className="space-y-3">
									<div>
										<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
											Model
										</label>
										<StyledInput
											type="text"
											value={personaConfig.model || ""}
											onChange={(e) =>
												handlePersonaFieldChange(
													personaKey,
													"model",
													e.target.value,
												)
											}
											placeholder="e.g., gpt-4, auto:speed>=4"
										/>
									</div>
									<div>
										<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
											Instructions
										</label>
										<StyledTextArea
											rows="4"
											value={personaConfig.instructions || ""}
											onChange={(e) =>
												handlePersonaFieldChange(
													personaKey,
													"instructions",
													e.target.value,
												)
											}
											placeholder="System instructions for this persona..."
										/>
									</div>
									<div className="grid grid-cols-2 gap-3">
										<div>
											<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
												Temperature
											</label>
											<StyledInput
												type="number"
												step="0.05"
												min="0"
												max="2"
												value={personaConfig.temperature ?? 0.7}
												onChange={(e) =>
													handlePersonaFieldChange(
														personaKey,
														"temperature",
														e.target.value,
													)
												}
											/>
										</div>
										<div>
											<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
												Top P
											</label>
											<StyledInput
												type="number"
												step="0.05"
												min="0"
												max="1"
												value={personaConfig.top_p ?? 1.0}
												onChange={(e) =>
													handlePersonaFieldChange(
														personaKey,
														"top_p",
														e.target.value,
													)
												}
											/>
										</div>
									</div>
								</div>
							</div>
						),
					)}
					<ActionButton
						onClick={handleAddPersona}
						variant="success"
						size="md"
						className="flex items-center gap-1"
					>
						<PlusCircle size={16} /> Add Persona
					</ActionButton>
				</div>
			</SettingsSection>

			{/* Indexed Files */}
			<SettingsSection title="Indexed Files">
				<div className="space-y-2">
					{config?.indexedFiles?.map((item, i) => (
						<div key={i} className="flex items-center space-x-2">
							<StyledInput
								type="text"
								value={item.path || ""}
								onChange={updateIndexed(i)}
								placeholder="path/to/indexed/directory_or_file"
							/>
							<ActionButton
								onClick={removeIndexed(i)}
								variant="danger"
								size="sm"
								className="p-1.5"
							>
								<Trash2 size={14} />
							</ActionButton>
						</div>
					))}
					<ActionButton
						onClick={addIndexed}
						variant="secondary"
						size="sm"
						className="flex items-center gap-1"
					>
						<PlusCircle size={14} /> Add Indexed Path
					</ActionButton>
				</div>
			</SettingsSection>

			{/* Watched Files */}
			<SettingsSection title="Watched Files">
				<div className="space-y-2">
					{config?.watchedFiles?.map((wf, i) => (
						<div key={i} className="flex items-center space-x-2">
							<StyledInput
								type="text"
								placeholder="path/to/watch"
								value={wf.path || ""}
								onChange={updateWatched(i, "path")}
							/>
							<StyledInput
								type="text"
								placeholder="Include Regex (optional)"
								value={wf.include || ""}
								onChange={updateWatched(i, "include")}
							/>
							<ActionButton
								onClick={removeWatched(i)}
								variant="danger"
								size="sm"
								className="p-1.5"
							>
								<Trash2 size={14} />
							</ActionButton>
						</div>
					))}
					<ActionButton
						onClick={addWatched}
						variant="secondary"
						size="sm"
						className="flex items-center gap-1"
					>
						<PlusCircle size={14} /> Add Watch
					</ActionButton>
				</div>
			</SettingsSection>

			{/* Resource Definitions Section */}
			<SettingsSection title="Resource Definitions">
				<div className="space-y-4">
					{Object.entries(config?.resources ?? {}).map(
						([resourceKey, resourceValue]) => (
							<div
								key={resourceKey}
								className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-850 shadow"
							>
								<div className="flex justify-between items-center mb-3">
									<h5 className="font-medium text-md text-gray-700 dark:text-gray-300">
										{resourceKey}
									</h5>
									<ActionButton
										onClick={() => handleRemoveResourceGroup(resourceKey)}
										variant="danger"
										size="sm"
									>
										Remove Group
									</ActionButton>
								</div>
								<div className="mb-3">
									<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
										Type
									</label>
									<StyledSelect
										value={resourceValue.type || "fileTree"}
										onChange={(e) =>
											handleResourceGroupTypeChange(resourceKey, e.target.value)
										}
									>
										{[
											"fileTree",
											"wholeFile",
											"repoMap",
											"testing",
											"symbol",
											"search",
										].map(
											(
												type, // Added more common types
											) => (
												<option key={type} value={type}>
													{type}
												</option>
											),
										)}
									</StyledSelect>
								</div>

								<div>
									<h6 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
										Items:
									</h6>
									<div className="space-y-2 pl-3 border-l-2 border-gray-200 dark:border-gray-700">
										{(resourceValue.items || []).map((item, itemIndex) => (
											<div
												key={itemIndex}
												className="p-2 rounded-md bg-gray-100 dark:bg-gray-750 border border-gray-200 dark:border-gray-600"
											>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-1">
													<StyledInput
														type="text"
														placeholder="Path (e.g., ./src, file.js)"
														value={item.path || ""}
														onChange={(e) =>
															handleResourceItemChange(
																resourceKey,
																itemIndex,
																"path",
																e.target.value,
															)
														}
													/>
													<StyledInput
														type="text"
														placeholder="Include Regex (optional)"
														value={item.include || ""}
														onChange={(e) =>
															handleResourceItemChange(
																resourceKey,
																itemIndex,
																"include",
																e.target.value,
															)
														}
													/>
												</div>
												<ActionButton
													onClick={() =>
														handleRemoveResourceItem(resourceKey, itemIndex)
													}
													variant="danger"
													size="sm"
													className="p-1.5 mt-1"
												>
													<Trash2 size={14} /> Remove Item
												</ActionButton>
											</div>
										))}
										<ActionButton
											onClick={() => handleAddResourceItem(resourceKey)}
											variant="secondary"
											size="sm"
											className="mt-2 flex items-center gap-1"
										>
											<PlusCircle size={14} /> Add Item to "{resourceKey}"
										</ActionButton>
									</div>
								</div>
							</div>
						),
					)}
					<ActionButton
						onClick={handleAddResourceGroup}
						variant="success"
						size="md"
						className="flex items-center gap-1"
					>
						<PlusCircle size={16} /> Add Resource Group
					</ActionButton>
				</div>
			</SettingsSection>

			{/* Save/Log action */}
			<div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
				<ActionButton
					onClick={saveConfig}
					variant="primary"
					size="md"
					className="w-full sm:w-auto"
				>
					Log Current Settings to Console
				</ActionButton>
			</div>
		</div>
	);
}
