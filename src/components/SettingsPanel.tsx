import { Moon, PlusCircle, Sun } from "lucide-react";
import React from "react";
import { useTheme } from "../context/ThemeProvider.tsx";
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
	const [profile, setProfile] = React.useState({
		name: "",
		email: "",
	});

	const { theme, setTheme } = useTheme();
	const { config, setConfigurationValue, getConfigurationValue } =
		useConfigurationStore();

	const handleDefaultChange =
		(field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setConfigurationValue(`defaults.${field}`, e.target.value);
		};

	const updateModelField =
		(modelKey: string, field: string) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setConfigurationValue(`models.${modelKey}.${field}`, e.target.value);
		};

	const handleAddModelConfiguration = () => {
		const newModelKey = window.prompt(
			"Enter a unique key for the new model configuration:",
		);
		if (newModelKey && newModelKey.trim() !== "") {
			const currentModels = getConfigurationValue("models") || {};
			if (currentModels.hasOwnProperty(newModelKey)) {
				alert(`Model configuration with key '${newModelKey}' already exists.`);
				return;
			}
			setConfigurationValue(`models.${newModelKey}`, {
				provider: "",
				apiKey: "",
				baseURL: "",
			});
		}
	};

	const handleRemoveModelConfiguration = (modelKeyToRemove: string) => {
		if (
			window.confirm(
				`Are you sure you want to remove the model configuration '${modelKeyToRemove}'?`,
			)
		) {
			const currentModels = getConfigurationValue("models") || {};
			const { [modelKeyToRemove]: _removed, ...remainingModels } =
				currentModels;
			setConfigurationValue("models", remainingModels);
		}
	};

	return (
		<div className="p-4 space-y-6 overflow-auto text-sm h-full">
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
					>
						{theme === "light" ? (
							<Moon size={20} className="text-gray-600" />
						) : (
							<Sun size={20} className="text-yellow-400" />
						)}
					</button>
				</div>
			</SettingsSection>

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
						Agent Type
					</label>
					<StyledInput
						type="text"
						value={config?.defaults?.agent || ""}
						onChange={handleDefaultChange("agent")}
						placeholder="e.g., interactiveCodeAgent"
					/>
				</div>
			</SettingsSection>

			<SettingsSection title="Model Configurations">
				<div className="space-y-4">
					{Object.entries(config?.models ?? {}).map(
						([modelKey, modelConfig]: [string, any]) => (
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
												value={String(value || "")}
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
		</div>
	);
}
