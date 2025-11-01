import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			enum: [
				"Strength",
				"Flexibility",
				"Mobility",
				"Cardio",
				"Balance",
				"Rehabilitation",
			],
			required: true,
		},
		difficulty: {
			type: String,
			enum: ["Easy", "Moderate", "Hard"],
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		instructions: [
			{
				step: Number,
				description: String,
			},
		],
		videoUrl: {
			type: String,
		},
		imageUrl: {
			type: String,
		},
		equipment: [String],
		targetAreas: [String],
		repetitions: {
			type: String,
		},
		sets: {
			type: Number,
		},
		precautions: [String],
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
