import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
	{
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
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
			type: mongoose.Schema.Types.ObjectId,
			ref: "Clinician",
		},
	},
	{ timestamps: true }
);

medicationSchema.index({ patientId: 1, isActive: 1 });

const Medication = mongoose.model("Medication", medicationSchema);

export default Medication;
