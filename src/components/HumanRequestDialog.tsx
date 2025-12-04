import { HumanInterfaceRequest } from "@tokenring-ai/agent/HumanInterfaceRequest";
import React, { useState } from "react";

type HumanRequestDialogProps = {
	request: HumanInterfaceRequest;
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
		switch (request.type) {
			case "askForText":
			case "askForPassword":
				onResponse(requestId, input);
				break;
			case "askForConfirmation":
				onResponse(requestId, true);
				break;
			case "askForSingleTreeSelection":
				onResponse(requestId, input);
				break;
			case "askForMultipleTreeSelection":
				onResponse(requestId, Array.from(selected));
				break;
			default:
				onResponse(requestId, null);
		}
	};

	const handleCancel = () => {
		onResponse(requestId, request.type === "askForConfirmation" ? false : null);
	};

	const getMessage = () => {
		if (request.type === "askForText" || request.type === "askForPassword" || request.type === "askForConfirmation") {
			return request.message;
		}
		return "Input Required";
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
				<h3 className="text-lg font-semibold mb-4">{getMessage()}</h3>

				{(request.type === "askForText" || request.type === "askForPassword") && (
					<input
						type={request.type === "askForPassword" ? "password" : "text"}
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
						{request.type === "askForConfirmation" ? "Confirm" : "Submit"}
					</button>
				</div>
			</div>
		</div>
	);
}
