import mongoose from "mongoose";

const carePathwaySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		procedureType: {
			type: String,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ["active", "inactive", "draft"],
			default: "active",
		},
		milestones: [
			{
				day: Number,
				title: String,
				description: String,
				tasks: [String],
			},
		],
		checkInSchedule: [
			{
				day: Number,
				frequency: String,
				questions: [
					{
						question: String,
						type: String,
						required: Boolean,
					},
				],
			},
		],
		medicationProtocol: [
			{
				name: String,
				dosage: String,
				frequency: String,
				startDay: Number,
				endDay: Number,
			},
		],
		exerciseProtocol: [
			{
				name: String,
				description: String,
				startDay: Number,
				frequency: String,
			},
		],
		alertThresholds: {
			temperature: {
				type: Number,
				default: 100.4,
			},
			painLevel: {
				type: Number,
				default: 8,
			},
			adherenceRate: {
				type: Number,
				default: 70,
			},
		},
		educationalResources: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Article",
			},
		],
	},
	{ timestamps: true }
);

const CarePathway = mongoose.model("CarePathway", carePathwaySchema);

export default CarePathway;
