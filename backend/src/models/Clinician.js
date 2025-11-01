import mongoose from "mongoose";

const clinicianSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
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

clinicianSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

const Clinician = mongoose.model("Clinician", clinicianSchema);

export default Clinician;
