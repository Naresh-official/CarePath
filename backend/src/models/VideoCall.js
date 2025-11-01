import mongoose from "mongoose";

const videoCallSchema = new mongoose.Schema(
	{
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
			required: true,
		},
		clinicianId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Clinician",
			required: true,
		},
		startTime: {
			type: Date,
			required: true,
		},
		endTime: {
			type: Date,
		},
		duration: {
			type: Number,
		},
		status: {
			type: String,
			enum: ["scheduled", "ringing", "connected", "completed", "cancelled"],
			default: "scheduled",
		},
		callType: {
			type: String,
			enum: ["video", "audio"],
			default: "video",
		},
		notes: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true }
);

videoCallSchema.index({ patientId: 1, startTime: -1 });
videoCallSchema.index({ clinicianId: 1, startTime: -1 });

const VideoCall = mongoose.model("VideoCall", videoCallSchema);

export default VideoCall;
