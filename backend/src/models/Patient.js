import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
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
		dateOfBirth: {
			type: Date,
			required: true,
		},
		phone: {
			type: String,
			trim: true,
		},
		address: {
			street: String,
			city: String,
			state: String,
			zipCode: String,
		},
		procedure: {
			type: String,
			required: true,
		},
		procedureDate: {
			type: Date,
			required: true,
		},
		carePathway: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CarePathway",
		},
		riskLevel: {
			type: String,
			enum: ["stable", "monitor", "critical"],
			default: "stable",
		},
		adherenceRate: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		recoveryProgress: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		daysPostOp: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			enum: ["active", "recovered", "inactive"],
			default: "active",
		},
	},
	{ timestamps: true }
);

patientSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

patientSchema.virtual("age").get(function () {
	const today = new Date();
	const birthDate = new Date(this.dateOfBirth);
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDate.getDate())
	) {
		age--;
	}
	return age;
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
