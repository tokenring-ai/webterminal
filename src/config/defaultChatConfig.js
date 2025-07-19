// apps/web-terminal/src/config/defaultChatConfig.js

// Default personas, can be expanded or overridden
const defaultPersonas = {
	code: {
		instructions:
			"You are an expert developer assistant in an interactive chat, with access to a variety of tools to safely update the users existing codebase and execute tasks the user has requested. " +
			"When the user tells you to do something, you should assume that the user is asking you to use the available tools to update their codebase. " +
			"You should prefer using tools to implement code changes, even large code changes. " +
			"When making code changes, give short and concise responses summarizing the code changes",
		model: "auto:speed>=4,intelligence>=3", // Example model string
		temperature: 0.2,
		top_p: 0.1,
	},
	architect: {
		instructions:
			"You are a software architect in an interactive chat with access to a variety of tools to safely update the users existing codebase and execute tasks the user has requested. " +
			"When the user tells you to do something, you should analyze their application code in detail until you are confident that you have all the information and tools necessary to complete the task the user has given you. ",
		model: "auto:reasoning>=5,intelligence>=5", // Example model string
		temperature: 0.2,
		top_p: 0.8,
	},
	// Add other personas as needed, e.g., code-reviewer, unit-test
};

export const defaultChatConfig = {
	defaults: {
		model: "gpt-4.1-nano", // Default model for the web terminal
		persona: "code", // Default persona
		personas: defaultPersonas,
		tools: [
			// Specify default tools by name if needed, otherwise use package defaults
			// "file",
			// "search",
			// "add-memory"
		],
		// selectedFiles: [], // Example if you had default selected files
	},
	models: {
		// Configuration for different model providers/endpoints
		// Keys here are typically model names or provider identifiers
		OpenAI: {
			// This was an example structure from initializeChatEnvironment
			baseURL: import.meta.env.VITE_OPENAI_API_BASE_URL, // Ensure Vite handles .env
			apiKey: import.meta.env.VITE_OPENAI_API_KEY,
			provider: "openai", // Useful for ModelRegistry to know how to handle it
		},
		// Example for another model, if ModelRegistry supports it
		// "ollama/llama2": {
		//   provider: "ollama",
		//   baseURL: "http://localhost:11434", // if ollama is local
		//   model: "llama2"
		// }
		// libraryModels can be a place for models defined directly in @token-ring/ai-client/models
		// libraryModels: { 'gpt-3.5-turbo': true } // if you want to ensure specific library models are available
	},
	// other top-level config sections from ConfigurationManagementService defaults if needed
	// resources: {},
	// indexedFiles: [],
	// watchedFiles: [],
};

export default defaultChatConfig;
