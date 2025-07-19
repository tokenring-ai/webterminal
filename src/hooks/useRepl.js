import {runCommand} from "@token-ring/chat/runCommand";
import runChat from "@token-ring/ai-client/runChat";
import {useCallback, useEffect, useMemo, useReducer, useState} from "react"; // Added useState
import {ChatService} from "@token-ring/chat";

const initialMessages = [{ kind: 'system', text: 'Welcome to the Token Ring Coder!'}];
export function useRepl(registry) {
 const chatService = useMemo(() => registry.requireFirstServiceByType(ChatService), [registry]);
 const [commandHistory, setCommandHistory] = useState([]);
 const [historyIndex, setHistoryIndex] = useState(-1);

 const [chunks, addChunk] = useReducer((prevState, chunk) => {
  if (chunk.kind === 'stdout') {
   const lastMessage = prevState?.[prevState.length - 1];

   if (lastMessage && lastMessage.kind === 'stdout') {
    lastMessage.text += chunk.text;
    return [...prevState.slice(0, -1), { kind: 'stdout', text: lastMessage.text + chunk.text }];
   }
  }
  return [...prevState, chunk];
 }, initialMessages);

 useEffect(() => {
  let currentOutputType = null;

  return chatService.subscribe({
   outputType(type) {
    currentOutputType = type;
   },

   waiting(msg) {
    addChunk({kind: 'system', text: `⏳ ${msg}`});
   },

   doneWaiting() {
    // no spinner needed – the UI could implement one if desired
   },

   systemLine(...msgs) {
    addChunk({kind: 'system', text: msgs.join(' ')});
   },

   errorLine(...msgs) {
    addChunk({kind: 'error', text: msgs.join(' ')});
   },

   warningLine(...msgs) {
    addChunk({kind: 'warning', text: msgs.join(' ')});
   },

   printHorizontalLine() {
    addChunk({kind: 'system', text: '─'.repeat(40)});
   },

   stdout(msg) {
    addChunk({kind: 'stdout', text: msg});
   },
  });
 }, [addChunk]);


 const handleInput = useCallback(async (line) => {
  let processedInput = (line ?? "").trim();
  if (processedInput === "") {
   processedInput = "/help";
  }

  // Add the user's input message to the chunks
  addChunk({kind: 'user', text: `> ${processedInput}`});

  // Add to history
  if (processedInput && (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== processedInput)) {
    setCommandHistory(prev => [...prev, processedInput]);
  }
  setHistoryIndex(-1); // Reset history index after submitting

  try {
   chatService.resetAbortController();

   let [,commandName, remainder] = processedInput.match(/^\/(\w+)\s*(.*)?$/) ?? [];
   if (!commandName) {
    commandName = "chat";
    remainder = processedInput;
   }

   await runCommand(commandName, remainder, registry);
  } catch (err) {
   console.error(err);
   if (chatService.getAbortSignal().aborted) {
    chatService.errorLine("[Operation cancelled by user]");
   } else {
    chatService.errorLine('[Error while processing request]', err);
   }
  }

  chatService.clearAbortController();
 }, [registry, addChunk, commandHistory, chatService]); // Added chatService and commandHistory to dependencies

 const getPreviousCommand = useCallback(() => {
  if (commandHistory.length === 0) return '';
  const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
  setHistoryIndex(newIndex);
  return commandHistory[newIndex];
 }, [commandHistory, historyIndex]);

 const getNextCommand = useCallback(() => {
  if (historyIndex === -1 || historyIndex >= commandHistory.length - 1) {
    setHistoryIndex(-1); // Reset if at the end or already new
    return ''; // Return empty to clear input
  }
  const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
  setHistoryIndex(newIndex);
  return commandHistory[newIndex];
 }, [commandHistory, historyIndex]);

 return {chunks, handleInput, getPreviousCommand, getNextCommand, historyIndex}; // Expose historyIndex
}