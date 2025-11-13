import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";

export const authorizeAdmin = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		if (req.user?.role !== "admin") {
			return res.status(403).json({
				statusCode: 403,
				success: false,
				message: "Forbidden: Admins only",
			});
		}
		next();
	}
);

export const authorizeDoctor = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		if (req.user?.role !== "doctor") {
			return res.status(403).json({
				statusCode: 403,
				success: false,
				message: "Forbidden: Doctors only",
			});
		}
		next();
	}
);

export const authorizePatient = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		if (req.user?.role !== "patient") {
			return res.status(403).json({
				statusCode: 403,
				success: false,
				message: "Forbidden: Patients only",
			});
		}
		next();
	}
);
