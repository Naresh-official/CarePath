import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
			enum: ["Recovery", "Medications", "Safety", "Wellness", "Nutrition"],
		},
		duration: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Clinician",
		},
		tags: [String],
		imageUrl: {
			type: String,
		},
		videoUrl: {
			type: String,
		},
		relatedArticles: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Article",
			},
		],
		readCount: {
			type: Number,
			default: 0,
		},
		isPublished: {
			type: Boolean,
			default: true,
		},
		publishedAt: {
			type: Date,
		},
	},
	{ timestamps: true }
);

articleSchema.index({ category: 1, isPublished: 1 });

const Article = mongoose.model("Article", articleSchema);

export default Article;
