import mongoose from "mongoose";

const readHistorySchema = new mongoose.Schema(
	{
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
			required: true,
		},
		articleId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Article",
			required: true,
		},
		readAt: {
			type: Date,
			default: Date.now,
		},
		completionPercentage: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		timeSpent: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

readHistorySchema.index({ patientId: 1, articleId: 1 }, { unique: true });

const ReadHistory = mongoose.model("ReadHistory", readHistorySchema);

export default ReadHistory;
