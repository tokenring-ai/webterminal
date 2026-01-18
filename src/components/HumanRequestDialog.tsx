import {type ParsedQuestionRequest, QuestionRequestSchema} from "@tokenring-ai/agent/AgentEvents";
import React, { useState } from "react";
import z from "zod";

type HumanRequestDialogProps = {
	request: ParsedQuestionRequest;
	requestId: string;
	onResponse: (requestId: string, response: any) => void;
};

export default function HumanRequestDialog({
	request,
	requestId,
	onResponse,
}: HumanRequestDialogProps) {
	const [input, setInput] = useState("");
	const [selected, setSelected] = useState<Set<string>>(new Set());

	const handleSubmit = () => {
    switch (request.question.type) {
      case "text":
        onResponse(requestId, input);
        break;
      case "treeSelect":
        onResponse(requestId, Array.from(selected));
        break;
      case "fileSelect":
        onResponse(requestId, Array.from(selected));
        break;
      case "form":
        onResponse(requestId, {});
        break;
      default:
        onResponse(requestId, null);
    }
	};

	const handleCancel = () => {
		onResponse(requestId, null);
	};

	const getMessage = () => {
		return request.message || "Input Required";
	};

	const isTextInput = request.question.type === "text";
	const isMasked = request.question.type === "text" && request.question.masked;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
				<h3 className="text-lg font-semibold mb-4">{getMessage()}</h3>

				{isTextInput && (
					<input
						type={isMasked ? "password" : "text"}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-4"
						autoFocus
					/>
				)}

				<div className="flex justify-end space-x-2">
					<button
						onClick={handleCancel}
						className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
					>
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
}
