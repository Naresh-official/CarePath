import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAssignment extends Document {
	patientId: mongoose.Types.ObjectId;
	doctorId: mongoose.Types.ObjectId;
	assignedDate: Date;
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
		doctorId: {
			type: Schema.Types.ObjectId,
			ref: "Doctor",
			required: true,
		},
		assignedDate: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const Assignment: Model<IAssignment> = mongoose.model<IAssignment>(
	"Assignment",
	assignmentSchema
);

export default Assignment;
