import { useState } from "react";
import { defaultChatConfig } from "../config/defaultChatConfig.js";

export const useConfigurationStore = () => {
	const [config, setConfig] = useState(defaultChatConfig);

	const getConfiguration = () => config;

	const getConfigurationValue = (path: string) => {
		const keys = path.split(".");
		let value: any = config;
		for (const key of keys) {
			value = value?.[key];
		}
		return value;
	};

	const setConfigurationValue = (path: string, value: unknown) => {
		const keys = path.split(".");
		setConfig((prev) => {
			const newConfig = JSON.parse(JSON.stringify(prev));
			let current: Record<string, unknown> = newConfig;
			for (let i = 0; i < keys.length - 1; i++) {
				if (!current[keys[i]]) current[keys[i]] = {};
				current = current[keys[i]] as Record<string, unknown>;
			}
			current[keys[keys.length - 1]] = value;
			return newConfig;
		});
	};

	const updateConfiguration = (updates: Record<string, unknown>) => {
		setConfig((prev) => ({ ...prev, ...updates }));
	};

	return {
		config,
		getConfiguration,
		getConfigurationValue,
		setConfigurationValue,
		updateConfiguration,
	};
};

export default useConfigurationStore;
