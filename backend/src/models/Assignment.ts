import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAssignmentPermissions {
	canViewMedicalRecords?: boolean;
	canEditCarePlan?: boolean;
	canPrescribeMedication?: boolean;
	canSendMessages?: boolean;
}

export interface IAssignment extends Document {
	patientId: mongoose.Types.ObjectId;
	clinicianId: mongoose.Types.ObjectId;
	role:
		| "Primary Surgeon"
		| "Primary Cardiologist"
		| "Care Coordinator"
		| "Physical Therapist"
		| "Anesthesiologist"
		| "Nurse"
		| "Secondary Clinician";
	assignedDate: Date;
	isActive: boolean;
	endDate?: Date;
	permissions?: IAssignmentPermissions;
	createdAt: Date;
	updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
	{
		patientId: {
			type: Schema.Types.ObjectId,
			ref: "Patient",
			required: true,
		},
		clinicianId: {
			type: Schema.Types.ObjectId,
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

const Assignment: Model<IAssignment> = mongoose.model<IAssignment>(
	"Assignment",
	assignmentSchema
);

export default Assignment;
