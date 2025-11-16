interface TaskItemProps {
	completed: boolean;
	title: string;
	time: string;
	onToggle?: () => void;
}

function TaskItem({ completed, title, time, onToggle }: TaskItemProps) {
	return (
		<div
			className={`flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors ${
				onToggle ? "cursor-pointer" : ""
			}`}
			onClick={onToggle}
		>
			<div
				className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
					completed ? "bg-primary border-primary" : "border-border"
				}`}
			>
				{completed && <span className="text-white text-sm">✓</span>}
			</div>
			<div className="flex-1 min-w-0">
				<p
					className={`font-medium ${
						completed
							? "line-through text-muted-foreground"
							: "text-foreground"
					}`}
				>
					{title}
				</p>
				<p className="text-xs text-muted-foreground">{time}</p>
			</div>
		</div>
	);
}

export default TaskItem;
