import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
	{
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
			required: true,
		},
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Clinician",
			required: true,
		},
		type: {
			type: String,
			enum: [
				"Clinical",
				"Progress",
				"Intervention",
				"Consultation",
				"Discharge",
				"Other",
			],
			required: true,
		},
		title: {
			type: String,
			trim: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "medium",
		},
		isPrivate: {
			type: Boolean,
			default: false,
		},
		attachments: [
			{
				filename: String,
				url: String,
				fileType: String,
				uploadedAt: Date,
			},
		],
		tags: [String],
	},
	{ timestamps: true }
);

noteSchema.index({ patientId: 1, createdAt: -1 });
noteSchema.index({ authorId: 1 });

const Note = mongoose.model("Note", noteSchema);

export default Note;
