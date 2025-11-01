import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		conversationId: {
			type: String,
			required: true,
			index: true,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		senderType: {
			type: String,
			enum: ["patient", "clinician"],
			required: true,
		},
		text: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ["sent", "delivered", "read"],
			default: "sent",
		},
		readAt: {
			type: Date,
		},
		attachments: [
			{
				type: String,
				url: String,
				filename: String,
			},
		],
		isSystemMessage: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, status: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
