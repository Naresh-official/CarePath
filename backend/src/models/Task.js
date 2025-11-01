import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
	{
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		type: {
			type: String,
			enum: [
				"medication",
				"exercise",
				"check-in",
				"appointment",
				"wound-check",
				"other",
			],
			required: true,
		},
		scheduledTime: {
			type: Date,
			required: true,
		},
		completed: {
			type: Boolean,
			default: false,
		},
		completedAt: {
			type: Date,
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "medium",
		},
		recurring: {
			enabled: {
				type: Boolean,
				default: false,
			},
			frequency: {
				type: String,
				enum: ["daily", "weekly", "monthly"],
			},
			endDate: Date,
		},
	},
	{ timestamps: true }
);

taskSchema.index({ patientId: 1, scheduledTime: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
