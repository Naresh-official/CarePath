import mongoose, { Document, Model, Schema } from "mongoose";

export interface IExerciseInstruction {
	step?: number;
	description?: string;
}

export interface IExercise extends Document {
	name: string;
	description: string;
	category:
		| "Strength"
		| "Flexibility"
		| "Mobility"
		| "Cardio"
		| "Balance"
		| "Rehabilitation";
	difficulty: "Easy" | "Moderate" | "Hard";
	duration: number;
	instructions?: IExerciseInstruction[];
	videoUrl?: string;
	imageUrl?: string;
	equipment?: string[];
	targetAreas?: string[];
	repetitions?: string;
	sets?: number;
	precautions?: string[];
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const exerciseSchema = new Schema<IExercise>(
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

const Exercise: Model<IExercise> = mongoose.model<IExercise>(
	"Exercise",
	exerciseSchema
);

export default Exercise;
