import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMedicationSchedule {
	time?: string;
}

export interface IMedication extends Document {
	patientId: mongoose.Types.ObjectId;
	name: string;
	dosage: string;
	frequency: string;
	schedule?: IMedicationSchedule[];
	startDate: Date;
	endDate?: Date;
	duration?: string;
	instructions?: string;
	sideEffects?: string[];
	adherenceRate: number;
	isActive: boolean;
	prescribedBy?: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const medicationSchema = new Schema<IMedication>(
	{
		patientId: {
			type: Schema.Types.ObjectId,
			ref: "Patient",
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		dosage: {
			type: String,
			required: true,
		},
		frequency: {
			type: String,
			required: true,
		},
		schedule: [
			{
				time: String,
			},
		],
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
		},
		duration: {
			type: String,
		},
		instructions: {
			type: String,
		},
		sideEffects: [String],
		adherenceRate: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		prescribedBy: {
			type: Schema.Types.ObjectId,
			ref: "Clinician",
		},
	},
	{ timestamps: true }
);

medicationSchema.index({ patientId: 1, isActive: 1 });

const Medication: Model<IMedication> = mongoose.model<IMedication>(
	"Medication",
	medicationSchema
);

export default Medication;
