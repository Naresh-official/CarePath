import { Response, Request } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { loginSchema } from "../schemas/auth.schema.js";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const login = asyncHandler(async (req: Request, res: Response) => {
	const { email, password, role } = loginSchema.parse(req.body);

	const user = await User.findOne({ email, role }).select("+password");

	if (!user) {
		throw new ApiError("Invalid email or role", 400);
	}

	const isPasswordValid = await user.comparePassword(password);
	if (!isPasswordValid) {
		throw new ApiError("Invalid password", 400);
	}

	user.lastLogin = new Date();
	await user.save();

	const token = jwt.sign(
		{
			id: user._id,
			email: user.email,
			role: user.role,
			name: user.fullName,
		},
		process.env.JWT_SECRET!,
		{ expiresIn: "7d" }
	);

	const isProduction = process.env.NODE_ENV === "production";

	res.cookie("authToken", token, {
		httpOnly: true,
		secure: isProduction, // false in development
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		sameSite: isProduction ? "none" : "lax", // "lax" in development
		path: "/",
	});

	return res.sendResponse({
		statusCode: 200,
		success: true,
		message: "Login successful",
		data: {
			id: user._id,
			email: user.email,
			role: user.role,
			name: user.fullName,
		},
	});
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
	const isProduction = process.env.NODE_ENV === "production";

	res.clearCookie("authToken", {
		httpOnly: true,
		secure: isProduction, // Must match login
		sameSite: isProduction ? "none" : "lax", // Must match login
		path: "/",
	});

	return res.sendResponse({
		statusCode: 200,
		success: true,
		message: "Logout successful",
	});
});

export const getCurrentUser = asyncHandler(
	async (req: Request, res: Response) => {
		const user = req.user;
		if (!user) {
			throw new ApiError("User not authenticated", 401);
		}

		return res.sendResponse({
			statusCode: 200,
			success: true,
			message: "Current user fetched successfully",
			data: {
				id: user.id,
				email: user.email,
				role: user.role,
				name: user.name,
			},
		});
	}
);
