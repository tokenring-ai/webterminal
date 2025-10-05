import React from "react";
import useConfigurationStore from "../hooks/useConfigurationStore.ts";

const SettingsSection = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<section className="mb-6">
		<h4 className="text-gray-400 text-sm font-semibold mb-4 px-2">
			{title.toUpperCase()}
		</h4>
		<div className="space-y-4">{children}</div>
	</section>
);

const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
	<input
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
}: {
	onClick: () => void;
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "danger" | "success";
	size?: "sm" | "md";
	className?: string;
}) => {
	const baseStyle =
		"px-3 py-1.5 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800";
	const sizeStyles: Record<"sm" | "md", string> = {
		sm: "text-xs",
		md: "text-sm",
	};
	const variantStyles: Record<
		"primary" | "secondary" | "danger" | "success",
		string
	> = {
		primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
		secondary:
			"bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 focus:ring-gray-400",
		danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
		success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500",
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

export default function SettingsPanel() {
	const { config, setConfigurationValue, getConfigurationValue } =
		useConfigurationStore();

	const handleDefaultChange =
		(field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setConfigurationValue(`defaults.${field}`, e.target.value);
		};

	const updateProviderField = (
		providerName: string,
		field: string,
		value: string,
	) => {
		setConfigurationValue(`ai.models.${providerName}.${field}`, value);
	};

	const handleAddProvider = () => {
		const providerName = window.prompt(
			"Enter a unique name for the provider (e.g., 'MyOpenAI'):",
		);
		if (providerName && providerName.trim() !== "") {
			const currentProviders = getConfigurationValue("ai.models") || {};
			if (currentProviders.hasOwnProperty(providerName)) {
				alert(`Provider '${providerName}' already exists.`);
				return;
			}
			setConfigurationValue(`ai.models.${providerName}`, {
				provider: "",
				apiKey: "",
			});
		}
	};

	const handleRemoveProvider = (providerName: string) => {
		if (
			window.confirm(
				`Are you sure you want to remove provider '${providerName}'?`,
			)
		) {
			const currentProviders = getConfigurationValue("ai.models") || {};
			const { [providerName]: _removed, ...remainingProviders } =
				currentProviders;
			setConfigurationValue("ai.models", remainingProviders);
		}
	};

	return (
		<div className="p-4 space-y-6 overflow-auto text-sm h-full">
			<SettingsSection title="Agents">
				<div className="space-y-4">
					{Object.entries(config.agents ?? {}).map(
						([agentName, agentConfig]: [string, any]) => (
							<div
								key={agentName}
								className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-850"
							>
								<h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
									{agentName}
								</h5>
								<div className="text-xs text-gray-500 dark:text-gray-400">
									Model: {agentConfig.model || "default"}
								</div>
							</div>
						),
					)}
				</div>
			</SettingsSection>

			<SettingsSection title="Default Model">
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Model Name
					</label>
					<StyledInput
						type="text"
						value={config.ai.defaultModel}
						onChange={handleDefaultChange("defaultModel")}
						placeholder="e.g., gpt-4.1"
					/>
				</div>
			</SettingsSection>

			<SettingsSection title="AI Providers">
				<div className="space-y-4">
					{Object.entries(config.ai.models ?? {}).map(
						([providerName, providerConfig]: [string, any]) => (
							<div
								key={providerName}
								className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-850 shadow"
							>
								<div className="flex justify-between items-center mb-3">
									<h5 className="font-medium text-md text-gray-700 dark:text-gray-300">
										{providerName}
									</h5>
									<ActionButton
										onClick={() => handleRemoveProvider(providerName)}
										variant="danger"
										size="sm"
									>
										Remove
									</ActionButton>
								</div>
								<div className="space-y-3">
									<div>
										<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
											Provider Type
										</label>
										<select
											value={providerConfig.provider || ""}
											onChange={(e) =>
												updateProviderField(
													providerName,
													"provider",
													e.target.value,
												)
											}
											className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										>
											<option value="">Select provider...</option>
											<option value="openai">OpenAI</option>
											<option value="anthropic">Anthropic</option>
											<option value="google">Google</option>
											<option value="groq">Groq</option>
											<option value="deepseek">DeepSeek</option>
											<option value="cerebras">Cerebras</option>
											<option value="xai">xAI</option>
											<option value="perplexity">Perplexity</option>
											<option value="openrouter">OpenRouter</option>
											<option value="ollama">Ollama</option>
											<option value="azure">Azure</option>
											<option value="openaiCompatible">
												OpenAI Compatible
											</option>
										</select>
									</div>
									{providerConfig.provider && (
										<>
											{providerConfig.provider !== "ollama" &&
												providerConfig.provider !== "openaiCompatible" && (
													<div>
														<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
															API Key
														</label>
														<StyledInput
															type="password"
															value={providerConfig.apiKey || ""}
															onChange={(e) =>
																updateProviderField(
																	providerName,
																	"apiKey",
																	e.target.value,
																)
															}
															placeholder="Enter API key"
														/>
													</div>
												)}
											{(providerConfig.provider === "azure" ||
												providerConfig.provider === "ollama" ||
												providerConfig.provider === "openaiCompatible") && (
												<div>
													<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
														Base URL
													</label>
													<StyledInput
														type="text"
														value={providerConfig.baseURL || ""}
														onChange={(e) =>
															updateProviderField(
																providerName,
																"baseURL",
																e.target.value,
															)
														}
														placeholder="Enter base URL"
													/>
												</div>
											)}
										</>
									)}
								</div>
							</div>
						),
					)}
					<ActionButton onClick={handleAddProvider} variant="success" size="md">
						Add Provider
					</ActionButton>
				</div>
			</SettingsSection>

			<SettingsSection title="Filesystem">
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Default Provider
					</label>
					<StyledInput
						type="text"
						value={config.filesystem?.defaultProvider || ""}
						onChange={(e) =>
							setConfigurationValue(
								"filesystem.defaultProvider",
								e.target.value,
							)
						}
						placeholder="e.g., browser"
					/>
				</div>
				<div className="space-y-3">
					{Object.entries(config.filesystem?.providers ?? {}).map(
						([providerName, providerConfig]: [string, any]) => (
							<div
								key={providerName}
								className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-850"
							>
								<h5 className="font-medium text-sm text-gray-700 dark:text-gray-300">
									{providerName}
								</h5>
								<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
									Type: {providerConfig.type}
								</div>
							</div>
						),
					)}
				</div>
			</SettingsSection>

			<SettingsSection title="Checkpoint">
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Default Provider
					</label>
					<StyledInput
						type="text"
						value={config.checkpoint?.defaultProvider || ""}
						onChange={(e) =>
							setConfigurationValue(
								"checkpoint.defaultProvider",
								e.target.value,
							)
						}
						placeholder="e.g., browser"
					/>
				</div>
				<div className="space-y-3">
					{Object.entries(config.checkpoint?.providers ?? {}).map(
						([providerName, providerConfig]: [string, any]) => (
							<div
								key={providerName}
								className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-850"
							>
								<h5 className="font-medium text-sm text-gray-700 dark:text-gray-300">
									{providerName}
								</h5>
								<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
									Type: {providerConfig.type}
								</div>
							</div>
						),
					)}
				</div>
			</SettingsSection>
		</div>
	);
}
