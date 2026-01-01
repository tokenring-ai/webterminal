import TokenRingApp, {PluginManager} from "@tokenring-ai/app";

import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { defaultChatConfig } from "./config/defaultChatConfig.ts";
import { TokenRingAppProvider } from "./context/TokenRingAppProvider.js";

import "./index.css";
import {plugins} from "./plugins.ts";

const container = document.getElementById("root")!;
const root = createRoot(container);

function TerminalCore() {
	const [app, setApp] = useState<TokenRingApp | null>(null);

	useEffect(() => {
		const initialize = async () => {
      const app = new TokenRingApp(import.meta.url, defaultChatConfig);


      const pluginManager = new PluginManager(app)
      app.addServices(pluginManager);

      await pluginManager.installPlugins(plugins)

			setApp(app);
      app.run();
		};

		initialize();
	}, []);

	if (!app) return <div>Loading...</div>;

	return (
		<TokenRingAppProvider app={app}>
			<App />
		</TokenRingAppProvider>
	);
}

root.render(
	<React.StrictMode>
		<TerminalCore />
	</React.StrictMode>,
);
