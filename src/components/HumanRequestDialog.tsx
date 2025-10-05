import { HumanInterfaceRequest } from "@tokenring-ai/agent/HumanInterfaceRequest";
import React, { useState } from "react";

type HumanRequestDialogProps = {
	request: HumanInterfaceRequest;
	sequence: number;
	onResponse: (sequence: number, response: any) => void;
};

export default function HumanRequestDialog({
	request,
	sequence,
	onResponse,
}: HumanRequestDialogProps) {
	const [input, setInput] = useState("");
	const [selected, setSelected] = useState<Set<string>>(new Set());

	const handleSubmit = () => {
		switch (request.type) {
			case "ask":
			case "askForPassword":
				onResponse(sequence, input);
				break;
			case "askForConfirmation":
				onResponse(sequence, true);
				break;
			case "askForSelection":
				onResponse(sequence, input);
				break;
			case "askForMultipleSelections":
				onResponse(sequence, Array.from(selected));
				break;
			default:
				onResponse(sequence, null);
		}
	};

	const handleCancel = () => {
		onResponse(sequence, request.type === "askForConfirmation" ? false : null);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
				<h3 className="text-lg font-semibold mb-4">
					{request.type === "ask" || request.type === "askForPassword"
						? request.message
						: request.type === "askForConfirmation"
							? request.message
							: request.type === "askForSelection"
								? request.message
								: request.type === "askForMultipleSelections"
									? request.message
									: "Input Required"}
				</h3>

				{(request.type === "ask" || request.type === "askForPassword") && (
					<input
						type={request.type === "askForPassword" ? "password" : "text"}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-4"
						autoFocus
					/>
				)}

				{request.type === "askForSelection" && (
					<select
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-4"
						autoFocus
					>
						<option value="">Select...</option>
						{request.choices.map((choice) => (
							<option key={choice.value} value={choice.value}>
								{choice.name}
							</option>
						))}
					</select>
				)}

				{request.type === "askForMultipleSelections" && (
					<div className="mb-4 max-h-60 overflow-y-auto">
						{request.options.map((option) => (
							<label key={option.value} className="flex items-center mb-2">
								<input
									type="checkbox"
									checked={selected.has(option.value)}
									onChange={(e) => {
										const newSelected = new Set(selected);
										if (e.target.checked) {
											newSelected.add(option.value);
										} else {
											newSelected.delete(option.value);
										}
										setSelected(newSelected);
									}}
									className="mr-2"
								/>
								{option.name}
							</label>
						))}
					</div>
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
