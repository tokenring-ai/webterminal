import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "light", setTheme: () => {} });

/**
 * Provides light/dark theme state across the application.
 * Persists preference to localStorage and updates <html> class.
 * @param {{children: React.ReactNode}} props
 */
export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(() => {
		if (typeof window === "undefined") return "light";
		const stored = localStorage.getItem("theme");
		if (stored) return stored;
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	});

	useEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		localStorage.setItem("theme", theme);
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	return useContext(ThemeContext);
}
