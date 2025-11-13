import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { registerAdminSchema } from "./schemas/admin.schema.js";
import User from "./models/User.js";
import apiResponseHandler from "./middlewares/apiResponseHandler.middleware.js";
import asyncHandler from "./utils/asyncHandler.js";
import { ApiError } from "./utils/apiError.js";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	})
);
app.use(cookieParser());
app.use(apiResponseHandler);

import authRouter from "./routers/auth.route.js";
import adminRouter from "./routers/admin.route.js";
import { authorizeAdmin } from "./middlewares/authorization.middleware.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", authMiddleware, authorizeAdmin, adminRouter);

app.get("/api/health", (req: Request, res: Response) => {
	res.status(200).json({ status: "OK", message: "Server is healthy" });
});

app.post(
	"/api/v1/register-admin",
	asyncHandler(async (req: Request, res: Response) => {
		const { email, firstName, lastName, password } =
			registerAdminSchema.parse(req.body);

		const existingAdmin = await User.findOne({ email, role: "admin" });
		if (existingAdmin) {
			throw new ApiError("Admin with this email already exists", 400);
		}

		const createdAdmin = await User.create({
			email,
			firstName,
			lastName,
			password,
			role: "admin",
		});

		return res.sendResponse({
			statusCode: 201,
			success: true,
			message: "Admin registered successfully",
			data: {
				id: createdAdmin._id,
			},
		});
	})
);

export default app;
