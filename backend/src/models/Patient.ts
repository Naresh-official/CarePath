import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPatient extends Document {
	userId: mongoose.Types.ObjectId;
	firstName: string;
	lastName: string;
	dateOfBirth: Date;
	phone?: string;
	address?: {
		street?: string;
		city?: string;
		state?: string;
		zipCode?: string;
	};
	procedure: string;
	procedureDate: Date;
	carePathway?: mongoose.Types.ObjectId;
	riskLevel: "stable" | "monitor" | "critical";
	adherenceRate: number;
	recoveryProgress: number;
	daysPostOp: number;
	status: "active" | "recovered" | "inactive";
	createdAt: Date;
	updatedAt: Date;
	fullName: string;
	age: number;
}

const patientSchema = new Schema<IPatient>(
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
			type: Schema.Types.ObjectId,
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

patientSchema.virtual("fullName").get(function (this: IPatient) {
	return `${this.firstName} ${this.lastName}`;
});

patientSchema.virtual("age").get(function (this: IPatient) {
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

const Patient: Model<IPatient> = mongoose.model<IPatient>(
	"Patient",
	patientSchema
);

export default Patient;
