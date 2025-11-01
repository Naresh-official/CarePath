import mongoose from "mongoose";

const symptomCheckInSchema = new mongoose.Schema(
	{
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
			required: true,
		},
		painLevel: {
			type: Number,
			required: true,
			min: 0,
			max: 10,
		},
		temperature: {
			type: Number,
			required: true,
		},
		bloodPressure: {
			systolic: Number,
			diastolic: Number,
			formatted: String,
		},
		mood: {
			type: String,
			enum: ["poor", "okay", "good", "excellent"],
			required: true,
		},
		notes: {
			type: String,
			trim: true,
		},
		image: {
			url: String,
			filename: String,
			uploadedAt: Date,
		},
		symptoms: [
			{
				type: String,
				description: String,
			},
		],
		flaggedForReview: {
			type: Boolean,
			default: false,
		},
		reviewedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Clinician",
		},
		reviewedAt: {
			type: Date,
		},
		checkInDate: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

symptomCheckInSchema.index({ patientId: 1, checkInDate: -1 });

const SymptomCheckIn = mongoose.model("SymptomCheckIn", symptomCheckInSchema);

export default SymptomCheckIn;
