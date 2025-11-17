import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import { messageApi } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";

function PatientHeader() {
	const { user } = useAuth();
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		if (!user) return;
		let isMounted = true;

		const fetchUnread = async () => {
			try {
				const response = await messageApi.getAllConversations();
				const conversations = (response.data.data || []) as Array<{
					unreadCount?: number;
				}>;
				if (!isMounted) return;
				const total = conversations.reduce(
					(sum, conv) => sum + (conv.unreadCount || 0),
					0
				);
				setUnreadCount(total);
			} catch {
				if (isMounted) setUnreadCount(0);
			}
		};

		fetchUnread();

		const socket = getSocket();

		const handleNewMessage = (msg: any) => {
			try {
				const receiver = msg?.receiverId;
				const receiverId =
					receiver && typeof receiver === "object"
						? receiver._id
						: receiver;
				if (receiverId === user.id) {
					setUnreadCount((count) => count + 1);
				}
			} catch {
				// ignore
			}
		};

		const handleMessageRead = () => {
			// When messages are marked as read, refresh from server
			fetchUnread();
		};

		socket.on("message:new", handleNewMessage);
		socket.on("message:read", handleMessageRead);

		return () => {
			isMounted = false;
			socket.off("message:new", handleNewMessage);
			socket.off("message:read", handleMessageRead);
		};
	}, [user]);

	const headerRoutes = [
		"home",
		"tasks",
		"checkin",
		"messages",
		"reports",
		"profile",
	];

	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 flex justify-around md:static md:border-b md:border-t-0 md:px-6 md:py-4 overflow-x-auto">
			{headerRoutes.map((route) => {
				const label = route.charAt(0).toUpperCase() + route.slice(1);
				return (
					<NavLink
						key={route}
						to={route}
						className={({ isActive }) =>
							`flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors ${
								isActive
									? "text-primary bg-primary/10"
									: "text-muted-foreground hover:text-foreground"
							}`
						}
					>
						<span className="flex items-center gap-1">
							{label}
							{route === "messages" && unreadCount > 0 && (
								<span className="ml-1 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs px-1.5 min-w-[1.25rem]">
									{unreadCount > 9 ? "9+" : unreadCount}
								</span>
							)}
						</span>
					</NavLink>
				);
			})}
		</nav>
	);
}

export default PatientHeader;
