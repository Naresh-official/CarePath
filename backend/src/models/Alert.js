import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
	{
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: [
				"High Fever",
				"Severe Pain",
				"Missed Medication",
				"Low Adherence",
				"Abnormal Vitals",
				"Wound Concern",
				"Check-in Completed",
				"Other",
			],
		},
		severity: {
			type: String,
			enum: ["normal", "warning", "critical"],
			required: true,
		},
		message: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ["active", "resolved", "dismissed"],
			default: "active",
		},
		triggeredBy: {
			source: {
				type: String,
				enum: ["symptom-checkin", "medication", "task", "manual", "system"],
			},
			referenceId: {
				type: mongoose.Schema.Types.ObjectId,
			},
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Clinician",
		},
		actions: [
			{
				action: String,
				performedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Clinician",
				},
				performedAt: Date,
				notes: String,
			},
		],
		resolvedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Clinician",
		},
		resolvedAt: {
			type: Date,
		},
	},
	{ timestamps: true }
);

alertSchema.index({ patientId: 1, status: 1, severity: 1 });
alertSchema.index({ assignedTo: 1, status: 1 });

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
