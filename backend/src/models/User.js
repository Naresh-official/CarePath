import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		role: {
			type: String,
			enum: ["patient", "doctor", "admin"],
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		lastLogin: {
			type: Date,
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
	const obj = this.toObject();
	delete obj.password;
	return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
