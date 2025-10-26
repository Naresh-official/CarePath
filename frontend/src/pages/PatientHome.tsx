import TaskItem from "@/components/TaskItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";

function PatientHome() {
	const completedToday = 3;
	const totalTasks = 7;
	const progressPercent = (completedToday / totalTasks) * 100;

	const navigate = useNavigate();

	return (
		<div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold text-foreground">
					Good Morning, Sarah
				</h1>
				<p className="text-muted-foreground">
					Day 5 Post-Op - You're doing great!
				</p>
			</div>

			{/* Progress Tracker */}
			<Card className="p-6 bg-linear-to-r from-primary/10 to-accent/10 border-primary/20">
				<div className="space-y-3">
					<div className="flex justify-between items-center">
						<h2 className="font-semibold text-foreground">
							Recovery Progress
						</h2>
						<span className="text-sm font-medium text-primary">
							{completedToday}/{totalTasks} tasks
						</span>
					</div>
					<div className="w-full bg-muted rounded-full h-3 overflow-hidden">
						<div
							className="bg-linear-to-r from-primary to-accent h-full transition-all duration-500"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
					<p className="text-sm text-muted-foreground">
						You're on track for a smooth recovery
					</p>
				</div>
			</Card>

			{/* Motivational Banner */}
			<Card className="p-4 bg-accent/10 border-accent/20">
				<p className="text-sm text-foreground">
					<span className="font-semibold">💡 Tip:</span> Staying
					hydrated and following your medication schedule are key to
					faster recovery.
				</p>
			</Card>

			{/* Quick Action Buttons */}
			<div className="grid grid-cols-2 gap-4">
				<Button
					size="lg"
					className="h-24 flex flex-col items-center justify-center gap-2 text-base"
					onClick={() => navigate("/checkin")}
				>
					<span className="text-2xl">📋</span>
					Symptom Check-in
				</Button>
				<Button
					size="lg"
					variant="outline"
					className="h-24 flex flex-col items-center justify-center gap-2 bg-transparent"
					onClick={() => navigate("/patient/messages")}
				>
					<span className="text-2xl">💬</span>
					Messages
				</Button>
			</div>

			{/* Today's Tasks Preview */}
			<div className="space-y-3">
				<h2 className="font-semibold text-lg text-foreground">
					Today's Tasks
				</h2>
				<div className="space-y-2">
					<TaskItem
						completed
						title="Morning Medication"
						time="8:00 AM"
					/>
					<TaskItem completed title="Wound Check" time="10:00 AM" />
					<TaskItem
						completed
						title="Physical Therapy"
						time="2:00 PM"
					/>
					<TaskItem
						completed={false}
						title="Evening Medication"
						time="8:00 PM"
					/>
					<TaskItem
						completed={false}
						title="Pain Assessment"
						time="9:00 PM"
					/>
				</div>
			</div>
		</div>
	);
}

export default PatientHome;
