import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
	{
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
			required: true,
		},
		clinicianId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Clinician",
			required: true,
		},
		role: {
			type: String,
			required: true,
			enum: [
				"Primary Surgeon",
				"Primary Cardiologist",
				"Care Coordinator",
				"Physical Therapist",
				"Anesthesiologist",
				"Nurse",
				"Secondary Clinician",
			],
		},
		assignedDate: {
			type: Date,
			default: Date.now,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		endDate: {
			type: Date,
		},
		permissions: {
			canViewMedicalRecords: {
				type: Boolean,
				default: true,
			},
			canEditCarePlan: {
				type: Boolean,
				default: false,
			},
			canPrescribeMedication: {
				type: Boolean,
				default: false,
			},
			canSendMessages: {
				type: Boolean,
				default: true,
			},
		},
	},
	{ timestamps: true }
);

assignmentSchema.index({ patientId: 1, isActive: 1 });
assignmentSchema.index({ clinicianId: 1, isActive: 1 });

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
