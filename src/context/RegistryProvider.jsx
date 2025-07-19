import React, { createContext, useContext } from "react";

// Create and export the context
export const RegistryContext = createContext(null);

export function RegistryProvider({ registry, children }) {
	return (
		<RegistryContext.Provider value={registry}>
			{children}
		</RegistryContext.Provider>
	);
}

export function useRegistry() {
	return useContext(RegistryContext);
}
