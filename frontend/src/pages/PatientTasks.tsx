import TaskItem from "@/components/TaskItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function PatientTasks() {
	const tasks = [
		{
			date: "Today",
			items: [
				{
					completed: true,
					title: "Morning Medication",
					time: "8:00 AM",
				},
				{ completed: true, title: "Wound Check", time: "10:00 AM" },
				{
					completed: false,
					title: "Physical Therapy",
					time: "2:00 PM",
				},
			],
		},
		{
			date: "Tomorrow",
			items: [
				{ completed: false, title: "Follow-up Call", time: "10:00 AM" },
				{ completed: false, title: "Lab Work", time: "1:00 PM" },
			],
		},
	];

	return (
		<div className="w-full p-4 md:p-6 gap-4 flex h-[calc(100vh-5rem)] overflow-hidden">
			<div className="w-[50%]">
				<h1 className="text-3xl font-semibold text-foreground">
					My Tasks
				</h1>

				{tasks.map((group) => (
					<div key={group.date} className="space-y-3">
						<h2 className="font-semibold text-lg text-primary">
							{group.date}
						</h2>
						<div className="space-y-2">
							{group.items.map((task, idx) => (
								<TaskItem key={idx} {...task} />
							))}
						</div>
					</div>
				))}
			</div>

			<div className="flex-1 h-full overflow-y-auto space-y-8 pr-4">
				<div className="space-y-3 mt-8">
					<h2 className="font-semibold text-3xl text-foreground">
						Medications
					</h2>
					<p className="text-sm text-muted-foreground">
						Your current prescriptions and schedules
					</p>
					<Card className="p-4 space-y-3">
						<MedicationItem
							name="Ibuprofen 400mg"
							schedule="Every 6 hours"
							dosage="1 tablet"
							nextDue="2:00 PM"
						/>
						<MedicationItem
							name="Amoxicillin 500mg"
							schedule="Twice daily"
							dosage="1 capsule"
							nextDue="6:00 PM"
						/>
						<MedicationItem
							name="Vitamin C 1000mg"
							schedule="Once daily"
							dosage="1 tablet"
							nextDue="Tomorrow 8:00 AM"
						/>
					</Card>
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

// Add explicit interfaces for props and replace `any` usages
interface MedicationItemProps {
	name: string;
	schedule: string;
	dosage: string;
	nextDue: string;
}

function MedicationItem({
	name,
	schedule,
	dosage,
	nextDue,
}: MedicationItemProps) {
	return (
		<div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
			<div className="flex-1">
				<p className="font-medium text-foreground">{name}</p>
				<p className="text-sm text-muted-foreground">{schedule}</p>
				<p className="text-xs text-muted-foreground mt-1">
					Dosage: {dosage} | Next due: {nextDue}
				</p>
			</div>
			<Button size="sm" variant="outline">
				Take
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
			<div className="bg-muted rounded-lg h-32 flex items-center justify-center text-muted-foreground">
				[Video/GIF Demonstration]
			</div>
		</Card>
	);
}

export default PatientTasks;
