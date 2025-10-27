import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

function Messages() {
	const [messageInput, setMessageInput] = useState("");
	const [callState, setCallState] = useState<
		"idle" | "ringing" | "connected" | "ended"
	>("idle");
	const [isMuted, setIsMuted] = useState(false);
	const [isVideoOn, setIsVideoOn] = useState(true);
	const [callDuration, setCallDuration] = useState(0);
	const [conversations, setConversations] = useState([
		{
			id: 1,
			name: "Dr. Johnson",
			role: "Surgeon",
			lastMessage: "How are you feeling today?",
			time: "2:30 PM",
			unread: true,
			messages: [
				{
					sender: "Dr. Johnson",
					text: "How are you feeling today?",
					time: "2:30 PM",
					isUser: false,
					status: "read",
				},
				{
					sender: "You",
					text: "Much better, thanks for checking in!",
					time: "2:45 PM",
					isUser: true,
					status: "read",
				},
			],
			callHistory: [
				{
					type: "video",
					duration: "12:34",
					date: "Today at 1:00 PM",
					status: "completed",
				},
			],
		},
		{
			id: 2,
			name: "Nurse Sarah",
			role: "Care Coordinator",
			lastMessage: "Remember to take your evening medication",
			time: "1:15 PM",
			unread: true,
			messages: [
				{
					sender: "Nurse Sarah",
					text: "Remember to take your evening medication",
					time: "1:15 PM",
					isUser: false,
					status: "read",
				},
			],
			callHistory: [],
		},
		{
			id: 3,
			name: "Dr. Martinez",
			role: "Physical Therapist",
			lastMessage: "Great progress on your exercises!",
			time: "Yesterday",
			unread: false,
			messages: [
				{
					sender: "Dr. Martinez",
					text: "Great progress on your exercises!",
					time: "Yesterday",
					isUser: false,
					status: "read",
				},
			],
			callHistory: [
				{
					type: "video",
					duration: "8:15",
					date: "Yesterday at 3:30 PM",
					status: "completed",
				},
				{
					type: "video",
					duration: "5:42",
					date: "2 days ago at 2:00 PM",
					status: "completed",
				},
			],
		},
	]);
	const [selectedConversation, setSelectedConversation] = useState(
		conversations[0]
	);

	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | undefined;
		if (callState === "connected") {
			interval = setInterval(() => {
				setCallDuration((prev) => prev + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [callState]);

	const handleSendMessage = () => {
		if (!messageInput.trim()) return;

		const updatedConversations = conversations.map((conv) => {
			if (conv.id === selectedConversation.id) {
				return {
					...conv,
					messages: [
						...conv.messages,
						{
							sender: "You",
							text: messageInput,
							time: new Date().toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							}),
							isUser: true,
							status: "sent",
						},
					],
					lastMessage: messageInput,
					unread: false,
				};
			}
			return conv;
		});
		setConversations(updatedConversations);
		setSelectedConversation(
			updatedConversations.find((c) => c.id === selectedConversation.id)!
		);
		setMessageInput("");
	};

	const handleInitiateCall = () => {
		setCallState("ringing");
		setCallDuration(0);
		setTimeout(() => {
			setCallState("connected");
		}, 3000);
	};

	const handleEndCall = () => {
		const updatedConversations = conversations.map((conv) => {
			if (conv.id === selectedConversation.id) {
				return {
					...conv,
					callHistory: [
						{
							type: "video",
							duration: `${Math.floor(
								callDuration / 60
							)}:${String(callDuration % 60).padStart(2, "0")}`,
							date: new Date().toLocaleString(),
							status: "completed",
						},
						...conv.callHistory,
					],
				};
			}
			return conv;
		});
		setConversations(updatedConversations);
		setSelectedConversation(
			updatedConversations.find((c) => c.id === selectedConversation.id)!
		);
		setCallState("idle");
		setCallDuration(0);
	};

	const formatCallDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${String(secs).padStart(2, "0")}`;
	};

	return (
		<div className="w-full mx-auto p-4 md:p-6 h-[calc(100vh-5rem)] flex flex-col md:flex-row gap-4">
			{/* Conversations List */}
			<div className="hidden md:flex md:w-80 flex-col border-r border-border">
				<h1 className="text-2xl font-bold text-foreground mb-4">
					Messages
				</h1>
				<div className="space-y-2 overflow-y-auto flex-1">
					{conversations.map((conv) => (
						<div
							key={conv.id}
							onClick={() => {
								setSelectedConversation(conv);
								setCallState("idle");
							}}
							className={`p-3 rounded-lg cursor-pointer transition-colors ${
								selectedConversation.id === conv.id
									? "bg-primary/10 border border-primary"
									: "hover:bg-muted border border-transparent"
							}`}
						>
							<div className="flex items-start justify-between gap-2">
								<div className="flex-1 min-w-0">
									<p
										className={`font-medium text-foreground ${
											conv.unread ? "font-bold" : ""
										}`}
									>
										{conv.name}
									</p>
									<p className="text-xs text-muted-foreground">
										{conv.role}
									</p>
									<p
										className={`text-sm truncate mt-1 ${
											conv.unread
												? "text-foreground font-medium"
												: "text-muted-foreground"
										}`}
									>
										{conv.lastMessage}
									</p>
								</div>
								{conv.unread && (
									<div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
								)}
							</div>
							<p className="text-xs text-muted-foreground mt-2">
								{conv.time}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* Chat Area */}
			<div className="flex-1 overflow-auto flex flex-col">
				{/* Header with Video Call Button */}
				<div className="pb-4 border-b border-border mb-4 flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-foreground">
							{selectedConversation.name}
						</h2>
						<p className="text-sm text-muted-foreground">
							{selectedConversation.role}
						</p>
					</div>
					{callState === "idle" && (
						<Button
							onClick={handleInitiateCall}
							className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
						>
							<span>📹</span>
							Start Video Call
						</Button>
					)}
				</div>

				{/* In-Call Interface */}
				{callState !== "idle" && (
					<Card className="p-4 mb-4 bg-linear-to-r from-blue-50 to-purple-50 border-blue-200">
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-semibold text-foreground">
										{callState === "ringing"
											? "Calling..."
											: "Connected"}
									</p>
									<p className="text-sm text-muted-foreground">
										{callState === "ringing"
											? "Waiting for response..."
											: formatCallDuration(callDuration)}
									</p>
								</div>
							</div>

							{/* Video Preview Area */}
							<div className="bg-black rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
								{isVideoOn ? (
									<div className="w-full h-full bg-linear-to-br from-gray-800 to-black flex items-center justify-center">
										<div className="text-center">
											<div className="text-6xl mb-2">
												📹
											</div>
											<p className="text-white text-sm">
												Your video
											</p>
										</div>
									</div>
								) : (
									<div className="flex flex-col items-center justify-center gap-2">
										<div className="text-4xl">🎥</div>
										<p className="text-white text-sm">
											Video off
										</p>
									</div>
								)}

								{/* Remote Video Indicator */}
								<div className="absolute top-4 right-4 w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-white">
									<div className="text-center">
										<div className="text-3xl">👨‍⚕️</div>
										<p className="text-white text-xs mt-1">
											{selectedConversation.name}
										</p>
									</div>
								</div>
							</div>

							{/* Call Controls */}
							<div className="flex items-center justify-center gap-4">
								<Button
									onClick={() => setIsMuted(!isMuted)}
									variant={
										isMuted ? "destructive" : "outline"
									}
									className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
									title={isMuted ? "Unmute" : "Mute"}
								>
									{isMuted ? "🔇" : "🎤"}
								</Button>
								<Button
									onClick={() => setIsVideoOn(!isVideoOn)}
									variant={
										!isVideoOn ? "destructive" : "outline"
									}
									className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
									title={
										isVideoOn
											? "Turn off video"
											: "Turn on video"
									}
								>
									{isVideoOn ? "📹" : "🎥"}
								</Button>
								<Button
									onClick={handleEndCall}
									className="bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 p-0 flex items-center justify-center"
									title="End call"
								>
									☎️
								</Button>
							</div>
						</div>
					</Card>
				)}

				{/* Emergency Banner */}
				<Card className="p-4 bg-yellow-50 border-yellow-200 text-sm text-yellow-800 mb-4">
					<p>
						This channel is for routine questions. For emergencies,
						call 108.
					</p>
				</Card>

				{/* Messages */}
				<div className="flex-1 space-y-3 overflow-y-auto mb-4">
					{selectedConversation.messages.map((msg, idx) => (
						<div
							key={idx}
							className={`flex ${
								msg.isUser ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`max-w-xs p-3 rounded-lg ${
									msg.isUser
										? "bg-primary text-primary-foreground"
										: "bg-muted text-foreground"
								}`}
							>
								<p className="text-sm">{msg.text}</p>
								<div className="flex items-center gap-1 mt-1">
									<p className="text-xs opacity-70">
										{msg.time}
									</p>
									{msg.isUser && (
										<span className="text-xs opacity-70">
											{msg.status === "sent"
												? "✓"
												: msg.status === "read"
												? "✓✓"
												: "..."}
										</span>
									)}
								</div>
							</div>
						</div>
					))}

					{selectedConversation.callHistory.length > 0 && (
						<div className="mt-6 pt-4 border-t border-border">
							<p className="text-xs font-semibold text-muted-foreground mb-3">
								CALL HISTORY
							</p>
							<div className="space-y-2">
								{selectedConversation.callHistory.map(
									(call, idx) => (
										<div
											key={idx}
											className="flex items-center gap-3 p-2 rounded bg-muted/50"
										>
											<span className="text-lg">📹</span>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground">
													Video Call
												</p>
												<p className="text-xs text-muted-foreground">
													{call.date}
												</p>
											</div>
											<p className="text-sm font-medium text-foreground">
												{call.duration}
											</p>
										</div>
									)
								)}
							</div>
						</div>
					)}
				</div>

				{/* Input Area */}
				<div className="flex gap-2 pt-4 border-t border-border">
					<input
						type="text"
						placeholder="Type a message..."
						value={messageInput}
						onChange={(e) => setMessageInput(e.target.value)}
						onKeyPress={(e) =>
							e.key === "Enter" && handleSendMessage()
						}
						className="flex-1 px-3 py-2 border border-border rounded-lg bg-input text-foreground"
						disabled={callState !== "idle"}
					/>
					<Button
						onClick={handleSendMessage}
						disabled={!messageInput.trim() || callState !== "idle"}
					>
						Send
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Messages;
