import React from "react";

type Notification = {
	id: string;
	message: string;
	time: string;
	read: boolean;
};

type NotificationDropdownProps = {
	notifications: Notification[];
	onClose: () => void;
	onMarkRead: (id: string) => void;
	onClearAll: () => void;
};

export default function NotificationDropdown({
	notifications,
	onClose,
	onMarkRead,
	onClearAll,
}: NotificationDropdownProps) {
	return (
		<>
			<div className="fixed inset-0 z-40" onClick={onClose} />
			<div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
				<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
					<h3 className="font-semibold text-gray-900 dark:text-white">
						Notifications
					</h3>
					{notifications.length > 0 && (
						<button
							onClick={onClearAll}
							className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
						>
							Clear all
						</button>
					)}
				</div>
				<div className="max-h-96 overflow-y-auto">
					{notifications.length === 0 ? (
						<div className="p-8 text-center text-gray-500 dark:text-gray-400">
							No notifications
						</div>
					) : (
						notifications.map((notif) => (
							<div
								key={notif.id}
								onClick={() => onMarkRead(notif.id)}
								className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
									!notif.read ? "bg-blue-50 dark:bg-gray-750" : ""
								}`}
							>
								<div className="flex items-start justify-between">
									<p className="text-sm text-gray-900 dark:text-gray-100 flex-1">
										{notif.message}
									</p>
									{!notif.read && (
										<span className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1.5" />
									)}
								</div>
								<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
									{notif.time}
								</p>
							</div>
						))
					)}
				</div>
			</div>
		</>
	);
}
