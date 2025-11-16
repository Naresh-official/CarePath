import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { patientApi, medicationApi, doctorApi } from "@/lib/api";
import type {
	Patient,
	Medication,
	Task,
	ExerciseTask,
	SymptomCheckIn,
} from "@/lib/types";
import PatientProfileHeader from "@/components/patient-profile/PatientProfileHeader";
import PatientOverview from "@/components/patient-profile/PatientOverview";
import MedicationManagement from "@/components/patient-profile/MedicationManagement";
import TaskManagement from "@/components/patient-profile/TaskManagement";
import ExerciseManagement from "@/components/patient-profile/ExerciseManagement";
import { toast } from "sonner";
import { isAxiosError } from "axios";

function PatientProfile() {
	const { patientId } = useParams<{ patientId: string }>();
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState<
		| "overview"
		| "checkins"
		| "medications"
		| "tasks"
		| "exercises"
		| "messages"
	>("overview");

	const [patient, setPatient] = useState<Patient | null>(null);
	const [medications, setMedications] = useState<Medication[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [exercises, setExercises] = useState<ExerciseTask[]>([]);
	const [checkIns, setCheckIns] = useState<SymptomCheckIn[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
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

	// Dialog state for check-in details
	const [selectedCheckIn, setSelectedCheckIn] =
		useState<SymptomCheckIn | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedRiskLevel, setSelectedRiskLevel] = useState<
		"stable" | "monitor" | "critical"
	>("stable");
	const [updatingRisk, setUpdatingRisk] = useState(false);

	const fetchPatientData = useCallback(async () => {
		try {
			setLoading(true);
			const response = await patientApi.getPatientDetails(patientId!);
			setPatient(response.data.data);
		} catch (err: unknown) {
			console.error("Error fetching patient:", err);
			setError(
				(err as { response?: { data?: { message?: string } } }).response
					?.data?.message || "Failed to load patient"
			);
		} finally {
			setLoading(false);
		}
	}, [patientId]);

	const fetchMedications = useCallback(async () => {
		try {
			const response = await medicationApi.getPatientMedications(
				patientId!
			);
			setMedications(response.data.data || []);
		} catch (err: unknown) {
			console.error("Error fetching medications:", err);
		}
	}, [patientId]);

	const fetchTasks = useCallback(async () => {
		try {
			const response = await doctorApi.getTasks(patientId!);
			setTasks(response.data.data || []);
		} catch (err: unknown) {
			console.error("Error fetching tasks:", err);
		}
	}, [patientId]);

	const fetchExercises = useCallback(async () => {
		try {
			const response = await doctorApi.getPatientExercises(patientId!);
			setExercises(response.data.data || []);

			console.log(response);
		} catch (err: unknown) {
			console.error("Error fetching exercises:", err);
		}
	}, [patientId]);

	const fetchCheckIns = useCallback(async () => {
		try {
			const response = await doctorApi.getCheckIns(patientId!);
			console.log(response);
			setCheckIns(
				response.data.data?.checkIns || response.data.data || []
			);
		} catch (err: unknown) {
			console.error("Error fetching check-ins:", err);
		}
	}, [patientId]);

	const handleCheckInClick = (checkIn: SymptomCheckIn) => {
		setSelectedCheckIn(checkIn);
		setSelectedRiskLevel(patient?.riskLevel || "stable");
		setDialogOpen(true);
	};

	const handleMarkAsReviewed = async () => {
		if (!selectedCheckIn) return;

		try {
			await doctorApi.markCheckInAsReviewed(selectedCheckIn._id);
			toast.success("Check-in marked as reviewed");
			fetchCheckIns();
			setDialogOpen(false);
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(
					error.response?.data?.message ||
						"Failed to mark as reviewed"
				);
			}
		}
	};

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

	const handleUpdateRiskLevel = async () => {
		if (!patientId) return;

		try {
			setUpdatingRisk(true);
			await doctorApi.updatePatientRiskLevel(
				patientId,
				selectedRiskLevel
			);
			toast.success("Patient risk level updated");
			fetchPatientData();
			handleMarkAsReviewed();
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(
					error.response?.data?.message ||
						"Failed to update risk level"
				);
			}
		} finally {
			setUpdatingRisk(false);
		}
	};

	useEffect(() => {
		if (!patientId) {
			setError("No patient ID provided");
			setLoading(false);
			return;
		}

		fetchPatientData();
		fetchMedications();
		fetchTasks();
		fetchExercises();
		fetchCheckIns();
	}, [
		patientId,
		fetchPatientData,
		fetchMedications,
		fetchTasks,
		fetchExercises,
		fetchCheckIns,
	]);

	if (loading) {
		return (
			<div className="p-4 md:p-6">
				<p className="text-muted-foreground">Loading patient data...</p>
			</div>
		);
	}

	if (error || !patient) {
		return (
			<div className="p-4 md:p-6">
				<Card className="p-4 bg-red-50 border-red-200">
					<p className="text-red-800">
						{error || "Patient not found"}
					</p>
					<Button
						size="sm"
						variant="outline"
						onClick={() => navigate("/doctor/dashboard")}
						className="mt-2"
					>
						Back to Dashboard
					</Button>
				</Card>
			</div>
		);
	}

	return (
		<div className="p-4 md:p-6 space-y-6">
			<PatientProfileHeader patient={patient} />

			{/* Tabs */}
			<div className="flex gap-2 border-b border-border overflow-x-auto">
				{(
					[
						"overview",
						"checkins",
						"medications",
						"tasks",
						"exercises",
						"messages",
					] as const
				).map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
							activeTab === tab
								? "text-primary border-b-2 border-primary"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						{tab === "checkins"
							? "Check-Ins"
							: tab === "messages"
							? "Messages"
							: tab.charAt(0).toUpperCase() + tab.slice(1)}
					</button>
				))}
			</div>

			{/* Tab Content */}
			<div className="space-y-4">
				{activeTab === "overview" && (
					<PatientOverview patient={patient} />
				)}

				{activeTab === "checkins" && (
					<div className="space-y-4">
						<Card className="p-6 space-y-4">
							<h2 className="font-semibold text-lg text-foreground">
								Check-In History
							</h2>

							{checkIns.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									No check-ins yet for this patient.
								</p>
							) : (
								<div className="space-y-4">
									{/* Unread Check-ins */}
									{checkIns.filter((c) => !c.isRead).length >
										0 && (
										<div className="space-y-2">
											<h3 className="font-medium text-sm text-foreground">
												Unread Check-Ins
											</h3>
											{checkIns
												.filter((c) => !c.isRead)
												.map((checkin) => (
													<Card
														key={checkin._id}
														onClick={() =>
															handleCheckInClick(
																checkin
															)
														}
														className="p-4 space-y-2 cursor-pointer hover:shadow-md transition-shadow bg-yellow-50 border-yellow-200"
													>
														<div className="flex justify-between items-start">
															<p className="text-sm text-muted-foreground">
																{new Date(
																	checkin.checkInDate ||
																		checkin.date ||
																		checkin.createdAt
																).toLocaleString()}
															</p>
															<span className="text-xs px-2 py-1 rounded-md border bg-yellow-100 text-yellow-800 border-yellow-300">
																Unread
															</span>
														</div>

														<div className="grid grid-cols-3 gap-2 text-sm">
															<div>
																<p className="text-muted-foreground">
																	Pain
																</p>
																<p className="font-semibold">
																	{
																		checkin.painLevel
																	}
																	/10
																</p>
															</div>
															<div>
																<p className="text-muted-foreground">
																	Temp
																</p>
																<p className="font-semibold">
																	{
																		checkin.temperature
																	}
																	°C
																</p>
															</div>
															<div>
																<p className="text-muted-foreground">
																	Mood
																</p>
																<p className="font-semibold capitalize">
																	{
																		checkin.mood
																	}
																</p>
															</div>
														</div>

														{checkin.image?.url && (
															<div className="text-xs text-muted-foreground">
																📷 Wound image
																attached
															</div>
														)}
													</Card>
												))}
										</div>
									)}

									{/* Read Check-ins */}
									{checkIns.filter((c) => c.isRead).length >
										0 && (
										<div className="space-y-2">
											<h3 className="font-medium text-sm text-foreground">
												Read Check-Ins
											</h3>
											{checkIns
												.filter((c) => c.isRead)
												.map((checkin) => (
													<Card
														key={checkin._id}
														onClick={() =>
															handleCheckInClick(
																checkin
															)
														}
														className="p-4 space-y-2 cursor-pointer hover:shadow-md transition-shadow bg-white border-gray-200"
													>
														<div className="flex justify-between items-start">
															<p className="text-sm text-muted-foreground">
																{new Date(
																	checkin.checkInDate ||
																		checkin.date ||
																		checkin.createdAt
																).toLocaleString()}
															</p>
															<span className="text-xs px-2 py-1 rounded-md border bg-green-100 text-green-800 border-green-200">
																Read
															</span>
														</div>

														<div className="grid grid-cols-3 gap-2 text-sm">
															<div>
																<p className="text-muted-foreground">
																	Pain
																</p>
																<p className="font-semibold">
																	{
																		checkin.painLevel
																	}
																	/10
																</p>
															</div>
															<div>
																<p className="text-muted-foreground">
																	Temp
																</p>
																<p className="font-semibold">
																	{
																		checkin.temperature
																	}
																	°C
																</p>
															</div>
															<div>
																<p className="text-muted-foreground">
																	Mood
																</p>
																<p className="font-semibold capitalize">
																	{
																		checkin.mood
																	}
																</p>
															</div>
														</div>

														{checkin.image?.url && (
															<div className="text-xs text-muted-foreground">
																📷 Wound image
																attached
															</div>
														)}
													</Card>
												))}
										</div>
									)}
								</div>
							)}
						</Card>
					</div>
				)}

				{activeTab === "medications" && (
					<MedicationManagement
						patientId={patientId!}
						medications={medications}
						onUpdate={fetchMedications}
					/>
				)}

				{activeTab === "tasks" && (
					<TaskManagement
						patientId={patientId!}
						tasks={tasks}
						onUpdate={fetchTasks}
					/>
				)}
				{activeTab === "exercises" && (
					<ExerciseManagement
						patientId={patientId!}
						exercises={exercises}
						onUpdate={fetchExercises}
					/>
				)}

				{activeTab === "messages" && (
					<Card className="p-4 md:p-6">
						<Tabs defaultValue="chat" className="w-full">
							<TabsList className="mb-4">
								<TabsTrigger value="chat">Message</TabsTrigger>
								<TabsTrigger value="video">
									Video calling
								</TabsTrigger>
							</TabsList>
							<TabsContent value="chat">
								<div className="flex flex-col md:flex-row gap-4">
									<div className="md:w-64 flex flex-col border-b md:border-b-0 md:border-r border-border pb-4 md:pb-0 md:pr-4">
										<h2 className="text-lg font-semibold text-foreground mb-2">
											Conversations
										</h2>
										<div className="space-y-2 max-h-64 overflow-y-auto">
											{conversations.map((conv) => (
												<button
													key={conv.id}
													type="button"
													onClick={() => {
														setSelectedConversation(conv);
														setCallState("idle");
													}}
													className={`w-full text-left p-3 rounded-lg border transition-colors ${
														selectedConversation.id === conv.id
															? "bg-primary/10 border-primary"
															: "hover:bg-muted border-transparent"
													}`}
												>
													<p className="font-medium text-foreground">
														{conv.name}
													</p>
													<p className="text-xs text-muted-foreground">
														{conv.role}
													</p>
													<p className="text-sm text-muted-foreground truncate mt-1">
														{conv.lastMessage}
													</p>
												</button>
											))}
										</div>
									</div>
									<div className="flex-1 flex flex-col">
										<div className="mb-3">
											<p className="text-sm font-medium text-foreground">
												{selectedConversation.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{selectedConversation.role}
											</p>
										</div>
										<div className="flex-1 space-y-3 overflow-y-auto mb-3 max-h-64">
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
														<p className="text-xs opacity-70 mt-1">
															{msg.time}
														</p>
													</div>
												</div>
											))}
										</div>
										<div className="flex gap-2 pt-2 border-t border-border">
											<input
												type="text"
												placeholder="Type a message..."
												value={messageInput}
												onChange={(e) => setMessageInput(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") handleSendMessage();
												}}
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
							</TabsContent>
							<TabsContent value="video">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-lg font-semibold text-foreground">
												Video calling
											</p>
											<p className="text-sm text-muted-foreground">
												Start a quick video check-in with the patient.
											</p>
										</div>
										{callState === "idle" && (
											<Button
												onClick={handleInitiateCall}
												className="bg-green-600 hover:bg-green-700 text-white"
											>
												Start Video Call
											</Button>
										)}
									</div>
									{callState !== "idle" && (
										<Card className="p-4 bg-linear-to-r from-blue-50 to-purple-50 border-blue-200">
											<div className="flex flex-col gap-4">
												<div className="flex items-center justify-between">
													<div>
														<p className="font-semibold text-foreground">
															{callState === "ringing" ? "Calling..." : "Connected"}
														</p>
														<p className="text-sm text-muted-foreground">
															{callState === "ringing"
																	? "Waiting for response..."
																	: formatCallDuration(callDuration)}
														</p>
													</div>
												</div>
												<div className="bg-black rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
													{isVideoOn ? (
														<div className="w-full h-full bg-linear-to-br from-gray-800 to-black flex items-center justify-center">
															<div className="text-center">
																<div className="text-6xl mb-2">📹</div>
																<p className="text-white text-sm">Your video</p>
															</div>
														</div>
													) : (
														<div className="flex flex-col items-center justify-center gap-2">
															<div className="text-4xl">🎥</div>
															<p className="text-white text-sm">Video off</p>
														</div>
													)}
													<div className="absolute top-4 right-4 w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-white">
														<div className="text-center">
															<div className="text-3xl">👨‍⚕️</div>
															<p className="text-white text-xs mt-1">
																{selectedConversation.name}
															</p>
														</div>
													</div>
												</div>
												<div className="flex items-center justify-center gap-4 mt-4">
													<Button
														onClick={() => setIsMuted(!isMuted)}
														variant={isMuted ? "destructive" : "outline"}
														className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
														title={isMuted ? "Unmute" : "Mute"}
													>
														{isMuted ? "🔇" : "🎤"}
													</Button>
													<Button
														onClick={() => setIsVideoOn(!isVideoOn)}
														variant={!isVideoOn ? "destructive" : "outline"}
														className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
														title={isVideoOn ? "Turn off video" : "Turn on video"}
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
									{selectedConversation.callHistory.length > 0 && (
										<div>
											<p className="text-xs font-semibold text-muted-foreground mb-2">
												Call history
											</p>
											<div className="space-y-2">
												{selectedConversation.callHistory.map((call, idx) => (
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
												))}
											</div>
										</div>
									)}
								</div>
							</TabsContent>
						</Tabs>
					</Card>
				)}
			</div>

			{/* Check-In Details Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Check-In Details</DialogTitle>
					</DialogHeader>

					{selectedCheckIn && (
						<div className="space-y-4">
							<div className="text-sm text-muted-foreground">
								{new Date(
									selectedCheckIn.checkInDate ||
										selectedCheckIn.date ||
										selectedCheckIn.createdAt
								).toLocaleString()}
							</div>

							{/* Vitals */}
							<div className="gap-4">
								<div className="space-y-1 flex items-center gap-5">
									<p className="text-sm text-muted-foreground">
										Pain Level
									</p>
									<p className="font-bold">
										{selectedCheckIn.painLevel}/10
									</p>
								</div>
								<div className="space-y-1 flex items-center gap-5">
									<p className="text-sm text-muted-foreground">
										Temperature
									</p>
									<p className="font-bold">
										{selectedCheckIn.temperature}°C
									</p>
								</div>
								<div className="space-y-1 flex items-center gap-5">
									<p className="text-sm text-muted-foreground">
										Blood Pressure
									</p>
									<p className="font-bold">
										{selectedCheckIn.bloodPressure
											?.formatted ||
											(selectedCheckIn.bloodPressure
												?.systolic &&
											selectedCheckIn.bloodPressure
												?.diastolic
												? `${selectedCheckIn.bloodPressure.systolic}/${selectedCheckIn.bloodPressure.diastolic}`
												: "N/A")}
									</p>
								</div>
								<div className="space-y-1 flex items-center gap-5">
									<p className="text-sm text-muted-foreground">
										Mood
									</p>
									<p className="font-bold capitalize">
										{selectedCheckIn.mood}
									</p>
								</div>
							</div>

							{/* Symptoms */}
							{selectedCheckIn.symptoms &&
								selectedCheckIn.symptoms.length > 0 && (
									<div className="space-y-2">
										<p className="text-sm font-medium">
											Reported Symptoms
										</p>
										<div className="flex flex-wrap gap-2">
											{selectedCheckIn.symptoms.map(
												(symptom, idx) => (
													<span
														key={idx}
														className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm"
													>
														{symptom.type ||
															symptom.description}
													</span>
												)
											)}
										</div>
									</div>
								)}

							{/* Notes */}
							{selectedCheckIn.notes && (
								<div className="space-y-2">
									<p className="text-sm font-medium">
										Additional Notes
									</p>
									<p className="text-sm text-muted-foreground">
										{selectedCheckIn.notes}
									</p>
								</div>
							)}

							{/* Wound Image */}
							{selectedCheckIn.image?.url && (
								<div className="space-y-2">
									<p className="text-sm font-medium">
										Wound Image
									</p>
									<img
										src={selectedCheckIn.image.url}
										alt="Wound"
										className="w-full h-auto max-h-96 object-contain rounded-lg border"
									/>
								</div>
							)}

							{/* Risk Level Management */}
							<div className="space-y-3 pt-4 border-t">
								<p className="text-sm font-medium">
									Update Patient Risk Level
								</p>
								<Select
									value={selectedRiskLevel}
									onValueChange={(value) =>
										setSelectedRiskLevel(
											value as
												| "stable"
												| "monitor"
												| "critical"
										)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select risk level" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="stable">
											Stable
										</SelectItem>
										<SelectItem value="monitor">
											Monitor
										</SelectItem>
										<SelectItem value="critical">
											Critical
										</SelectItem>
									</SelectContent>
								</Select>

								<div className="flex gap-2">
									{!selectedCheckIn.isRead && (
										<Button
											onClick={handleMarkAsReviewed}
											variant="outline"
											className="flex-1"
										>
											Mark as Reviewed
										</Button>
									)}
									<Button
										onClick={handleUpdateRiskLevel}
										disabled={
											updatingRisk ||
											selectedRiskLevel ===
												patient?.riskLevel
										}
										className="flex-1"
									>
										{updatingRisk
											? "Updating..."
											: "Update Risk Level"}
									</Button>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default PatientProfile;
