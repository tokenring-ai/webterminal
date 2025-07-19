import React from 'react';
import { useChat } from '../hooks/useChat';
import { RegistryProvider } from '../context/RegistryProvider';
import Terminal from './Terminal'; // Assuming Terminal is the component that shows chat messages and takes input

const ChatInstance = ({ configService, isActive }) => {
  const { registry, isLoading, error } = useChat(configService);

  if (!isActive) {
    // Optional: Don't render or initialize if the tab is not active.
    // This could save resources if useChat's useEffect is sensitive to being in the DOM.
    // However, useChat's dependency is configService, so it initializes when that's available.
    // For now, we'll let it initialize and rely on parent to only render active,
    // or simply let it be in the background.
    // If not active, we can render nothing or a placeholder to keep the DOM structure light.
    return null;
  }

  if (isLoading) {
    return <div className="p-4">Loading chat environment...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 whitespace-pre-wrap">
        <p className="font-semibold">Error initializing chat environment for this tab.</p>
        <p className="mt-2">{error.message}</p>
        {error.stack && (
          <details className="mt-2">
            <summary className="cursor-pointer">Stack trace</summary>
            <pre className="overflow-auto text-xs">{error.stack}</pre>
          </details>
        )}
        <p className="mt-2">Check the browser console for more details.</p>
      </div>
    );
  }

  if (!registry) {
    // Should be covered by isLoading or error
    return <div className="p-4">Chat environment not available.</div>;
  }

  // The actual chat UI for this instance will go here.
  // It needs access to the chat-specific registry.
  return (
    <RegistryProvider registry={registry}>
      <div className="h-full flex flex-col">
        {/*
          This is where you'd integrate the main chat UI.
          For example, if Terminal.jsx is the primary chat window:
        */}
        <Terminal />
        {/*
          You might also need other components that were previously in MainPanel,
          or MainPanel itself might be refactored to take a registry.
          For now, a simple Terminal placeholder is fine for this step.
          The existing Terminal component might need to be adapted to use useRepl with the provided registry.
        */}
      </div>
    </RegistryProvider>
  );
};

export default ChatInstance;
