import mongoose, { Document, Model, Schema } from "mongoose";

export interface IClinician extends Document {
	userId: mongoose.Types.ObjectId;
	firstName: string;
	lastName: string;
	role:
		| "Surgeon"
		| "Cardiologist"
		| "Nurse"
		| "Care Coordinator"
		| "Physical Therapist"
		| "Anesthesiologist";
	phone?: string;
	specialization?: string;
	licenseNumber?: string;
	verified: boolean;
	status: "active" | "inactive" | "pending";
	createdAt: Date;
	updatedAt: Date;
	fullName: string;
}

const clinicianSchema = new Schema<IClinician>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			required: true,
			enum: [
				"Surgeon",
				"Cardiologist",
				"Nurse",
				"Care Coordinator",
				"Physical Therapist",
				"Anesthesiologist",
			],
		},
		phone: {
			type: String,
			trim: true,
		},
		specialization: {
			type: String,
			trim: true,
		},
		licenseNumber: {
			type: String,
			trim: true,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		status: {
			type: String,
			enum: ["active", "inactive", "pending"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

clinicianSchema.virtual("fullName").get(function (this: IClinician) {
	return `${this.firstName} ${this.lastName}`;
});

const Clinician: Model<IClinician> = mongoose.model<IClinician>(
	"Clinician",
	clinicianSchema
);

export default Clinician;
