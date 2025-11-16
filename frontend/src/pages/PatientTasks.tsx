import { useEffect, useState } from "react";
import TaskItem from "@/components/TaskItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { patientApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Task, Medication } from "@/lib/types";
import { toast } from "sonner";

function PatientTasks() {
	const { user, loading: authLoading } = useAuth();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [medications, setMedications] = useState<Medication[]>([]);
	const [loading, setLoading] = useState(true);
	const [patientId, setPatientId] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (authLoading || !user) return;

			try {
				setLoading(true);

				const analyticsRes = await patientApi.getAnalytics();

				console.log(analyticsRes);

				const fetchedPatientId = analyticsRes.data.data?.patient?._id;

				console.log(fetchedPatientId);

				if (!fetchedPatientId) {
					throw new Error("Could not find patient profile");
				}

				setPatientId(fetchedPatientId);

				const tasksRes = await patientApi.getTasks(fetchedPatientId);
				const allTasks = tasksRes.data.data || [];
				setTasks(
					allTasks.filter((task: Task) => task.type !== "medication")
				);

				const medsRes = await patientApi.getMyMedications();
				setMedications(medsRes.data.data || []);
			} catch (error) {
				console.error("Error fetching data:", error);
				const err = error as {
					response?: { data?: { message?: string } };
				};
				toast.error(
					err.response?.data?.message ||
						"Failed to load tasks and medications"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [user, authLoading]);

	const handleTaskToggle = async (taskId: string, completed: boolean) => {
		if (!patientId) return;

		try {
			await patientApi.updateTask(taskId, { completed });
			setTasks((prev) =>
				prev.map((task) =>
					task._id === taskId ? { ...task, completed } : task
				)
			);
			toast.success(
				completed ? "Task completed!" : "Task marked as incomplete"
			);
		} catch (error: unknown) {
			console.error("Error updating task:", error);
			toast.error("Failed to update task");
		}
	};

	const handleDoseTaken = async (medicationId: string, timeOfDay: string) => {
		try {
			await patientApi.markDoseAsTaken(medicationId, timeOfDay);

			// Refresh medications to update UI
			const medsRes = await patientApi.getMyMedications();
			setMedications(medsRes.data.data || []);

			toast.success(
				`${
					timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)
				} dose marked as taken`
			);
		} catch (error: unknown) {
			console.error("Error marking dose:", error);
			const err = error as { response?: { data?: { message?: string } } };
			toast.error(
				err.response?.data?.message || "Failed to mark dose as taken"
			);
		}
	};

	// Group tasks by date
	const groupTasksByDate = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const groups: { date: string; items: Task[] }[] = [];
		const todayTasks = tasks.filter((task) => {
			const taskDate = new Date(task.scheduledTime);
			taskDate.setHours(0, 0, 0, 0);
			return taskDate.getTime() === today.getTime();
		});

		const tomorrowTasks = tasks.filter((task) => {
			const taskDate = new Date(task.scheduledTime);
			taskDate.setHours(0, 0, 0, 0);
			return taskDate.getTime() === tomorrow.getTime();
		});

		if (todayTasks.length > 0)
			groups.push({ date: "Today", items: todayTasks });
		if (tomorrowTasks.length > 0)
			groups.push({ date: "Tomorrow", items: tomorrowTasks });

		return groups;
	};

	if (loading) {
		return (
			<div className="w-full p-4 md:p-6">
				<h1 className="text-3xl font-semibold text-foreground">
					Loading...
				</h1>
			</div>
		);
	}

	const taskGroups = groupTasksByDate();

	return (
		<div className="w-full p-4 md:p-6 gap-4 flex h-[calc(100vh-5rem)] overflow-hidden">
			<div className="w-[50%]">
				<h1 className="text-3xl font-semibold text-foreground">
					My Tasks
				</h1>

				{taskGroups.length === 0 ? (
					<Card className="p-6 text-center mt-4">
						<p className="text-muted-foreground">
							No tasks scheduled
						</p>
					</Card>
				) : (
					taskGroups.map((group) => (
						<div key={group.date} className="space-y-3">
							<h2 className="font-semibold text-lg text-primary">
								{group.date}
							</h2>
							<div className="space-y-2">
								{group.items.map((task) => (
									<TaskItem
										key={task._id}
										completed={task.completed}
										title={task.title}
										time={new Date(
											task.scheduledTime
										).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
										onToggle={() =>
											handleTaskToggle(
												task._id,
												!task.completed
											)
										}
									/>
								))}
							</div>
						</div>
					))
				)}
			</div>

			{/* TODO : sent sms / email reminder */}
			<div className="flex-1 h-full overflow-y-auto space-y-8 pr-4">
				<div className="space-y-3 mt-8">
					<h2 className="font-semibold text-3xl text-foreground">
						Medications
					</h2>
					<p className="text-sm text-muted-foreground">
						Your current prescriptions and schedules
					</p>
					{medications.length === 0 ? (
						<Card className="p-6 text-center">
							<p className="text-muted-foreground">
								No active medications
							</p>
						</Card>
					) : (
						<Card className="p-4 space-y-3">
							{medications.map((med) => (
								<MedicationItem
									key={med._id}
									medication={med}
									onDoseTaken={handleDoseTaken}
								/>
							))}
						</Card>
					)}
				</div>
				<div className="space-y-3 mt-8">
					<h2 className="font-semibold text-3xl text-foreground">
						Exercise Demonstrations
					</h2>
					<p className="text-sm text-muted-foreground">
						Follow these step-by-step instructions for your physical
						therapy
					</p>
					<Card className="p-4 space-y-4">
						<ExerciseDemo
							title="Ankle Circles"
							duration="5 min"
							difficulty="Easy"
						/>
						<ExerciseDemo
							title="Quad Sets"
							duration="10 min"
							difficulty="Moderate"
						/>
						<ExerciseDemo
							title="Heel Slides"
							duration="8 min"
							difficulty="Moderate"
						/>
					</Card>
				</div>
			</div>
		</div>
	);
}

// Medication Item Component
interface MedicationItemProps {
	medication: Medication;
	onDoseTaken: (medicationId: string, timeOfDay: string) => void;
}

function MedicationItem({ medication, onDoseTaken }: MedicationItemProps) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Check which doses have been taken today
	const getDoseStatus = (timeOfDay: string) => {
		return medication.dosesTaken.some((dose) => {
			const doseDate = new Date(dose.date);
			doseDate.setHours(0, 0, 0, 0);
			return (
				doseDate.getTime() === today.getTime() &&
				dose.timeOfDay === timeOfDay
			);
		});
	};

	const foodRelationText = {
		before: "before food",
		after: "after food",
		with: "with food",
		empty_stomach: "on empty stomach",
	};

	// Get scheduled hour for each time of day
	const getScheduledHour = (timeOfDay: string): number => {
		const timeMap = {
			morning: 8,
			afternoon: 14,
			night: 20,
		};
		return timeMap[timeOfDay as keyof typeof timeMap];
	};

	// Check if current time has passed the scheduled time for a dose
	const isDoseTimeReached = (timeOfDay: string): boolean => {
		const now = new Date();
		const scheduledHour = getScheduledHour(timeOfDay);
		return now.getHours() >= scheduledHour;
	};

	// Get next untaken dose that is due now
	const getNextAvailableDose = () => {
		for (const timing of medication.timings) {
			const isTaken = getDoseStatus(timing.timeOfDay);
			const isTimeReached = isDoseTimeReached(timing.timeOfDay);

			if (!isTaken && isTimeReached) {
				return timing.timeOfDay;
			}
		}
		return null;
	};

	// Get next untaken dose for display
	const getNextDose = () => {
		for (const timing of medication.timings) {
			if (!getDoseStatus(timing.timeOfDay)) {
				const timeMap = {
					morning: "08:00 AM",
					afternoon: "02:00 PM",
					night: "08:00 PM",
				};
				return `${timing.timeOfDay} - ${timeMap[timing.timeOfDay]}`;
			}
		}
		return "All doses taken today";
	};

	const nextAvailableDose = getNextAvailableDose();
	const isButtonDisabled = nextAvailableDose === null;

	return (
		<div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
			<div className="flex-1">
				<p className="font-medium text-foreground">{medication.name}</p>
				<p className="text-sm text-muted-foreground">
					{medication.timings.length}{" "}
					{medication.timings.length === 1 ? "time" : "times"} daily •{" "}
					{foodRelationText[medication.foodRelation]}
				</p>
				<p className="text-xs text-muted-foreground mt-1">
					Next due: {getNextDose()}
				</p>
			</div>
			<Button
				size="sm"
				variant="outline"
				disabled={isButtonDisabled}
				onClick={() => {
					if (nextAvailableDose) {
						onDoseTaken(medication._id, nextAvailableDose);
					}
				}}
			>
				{isButtonDisabled ? "Not Yet Due" : "Taken"}
			</Button>
		</div>
	);
}

interface ExerciseDemoProps {
	title: string;
	duration: string;
	difficulty: string;
}

function ExerciseDemo({ title, duration, difficulty }: ExerciseDemoProps) {
	return (
		<Card className="p-4 border-l-4 border-l-primary">
			<div className="flex items-start justify-between mb-3">
				<div>
					<h3 className="font-semibold text-foreground">{title}</h3>
					<p className="text-sm text-muted-foreground">
						{duration} • {difficulty}
					</p>
				</div>
				<Button size="sm">View Demo</Button>
			</div>
		</Card>
	);
}

export default PatientTasks;
