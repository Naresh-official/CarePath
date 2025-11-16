import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { validateRequest } from "../utils/validation.js";
import SymptomCheckIn from "../models/SymptomCheckIn.js";
import Patient from "../models/Patient.js";
import Alert from "../models/Alert.js";

// Submit daily health update
export const submitSymptomCheckIn = asyncHandler(
	async (req: Request, res: Response) => {
		const {
			patientId,
			painLevel,
			temperature,
			bloodPressure,
			mood,
			notes,
			symptoms,
			image,
		} = req.body;

		validateRequest([
			{
				field: "patientId",
				value: patientId,
				rules: { required: true, type: "string" },
			},
			{
				field: "painLevel",
				value: painLevel,
				rules: { required: true, type: "number", min: 0, max: 10 },
			},
			{
				field: "temperature",
				value: temperature,
				rules: { required: true, type: "number" },
			},
			{
				field: "mood",
				value: mood,
				rules: {
					required: true,
					enum: ["poor", "okay", "good", "excellent"],
				},
			},
		]);

		const patient = await Patient.findById(patientId);
		if (!patient) {
			throw new ApiError("Patient not found", 404);
		}

		const checkIn = await SymptomCheckIn.create({
			patientId,
			painLevel,
			temperature,
			bloodPressure,
			mood,
			notes,
			symptoms,
			image,
			checkInDate: new Date(),
		});

		// AI-driven risk analysis
		let flaggedForReview = false;
		let alertType:
			| "High Fever"
			| "Severe Pain"
			| "Abnormal Vitals"
			| "Check-in Completed" = "Check-in Completed";
		let severity: "normal" | "warning" | "critical" = "normal";
		let alertMessage = "Daily check-in completed successfully";

		// Critical conditions
		if (temperature > 101 || temperature < 95) {
			flaggedForReview = true;
			alertType = "High Fever";
			severity = "critical";
			alertMessage = `Critical: Temperature is ${temperature}°F`;
		} else if (painLevel >= 8) {
			flaggedForReview = true;
			alertType = "Severe Pain";
			severity = "critical";
			alertMessage = `Critical: Patient reports severe pain level ${painLevel}/10`;
		} else if (painLevel >= 6 || temperature > 99.5) {
			flaggedForReview = true;
			alertType = "Abnormal Vitals";
			severity = "warning";
			alertMessage = `Warning: Pain level ${painLevel}/10 or elevated temperature ${temperature}°F`;
		}

		if (flaggedForReview) {
			checkIn.flaggedForReview = true;
			await checkIn.save();

			// Update patient risk level
			if (severity === "critical") {
				patient.riskLevel = "critical";
			} else if (
				severity === "warning" &&
				patient.riskLevel === "stable"
			) {
				patient.riskLevel = "monitor";
			}
			await patient.save();
		}

		// Create alert
		await Alert.create({
			patientId,
			type: alertType,
			severity,
			message: alertMessage,
			triggeredBy: {
				source: "symptom-checkin",
				referenceId: checkIn._id,
			},
		});

		return res.sendResponse({
			statusCode: 201,
			success: true,
			message: "Symptom check-in submitted successfully",
			data: {
				checkIn,
				flaggedForReview,
				riskLevel: patient.riskLevel,
			},
		});
	}
);

// Get all check-ins for a patient
export const getPatientCheckIns = asyncHandler(
	async (req: Request, res: Response) => {
		const { patientId } = req.params;
		const { page = 1, limit = 10, startDate, endDate } = req.query;

		const query: any = { patientId };

		if (startDate || endDate) {
			query.checkInDate = {};
			if (startDate)
				query.checkInDate.$gte = new Date(startDate as string);
			if (endDate) query.checkInDate.$lte = new Date(endDate as string);
		}

		const skip = (Number(page) - 1) * Number(limit);

		const [checkIns, total] = await Promise.all([
			SymptomCheckIn.find(query)
				.sort({ checkInDate: -1 })
				.skip(skip)
				.limit(Number(limit)),
			SymptomCheckIn.countDocuments(query),
		]);

		return res.sendResponse({
			statusCode: 200,
			success: true,
			message: "Check-ins retrieved successfully",
			data: {
				checkIns,
				pagination: {
					currentPage: Number(page),
					totalPages: Math.ceil(total / Number(limit)),
					total,
					limit: Number(limit),
				},
			},
		});
	}
);

// Get recovery trends/analytics
export const getRecoveryTrends = asyncHandler(
	async (req: Request, res: Response) => {
		const { patientId } = req.params;
		const { days = 30 } = req.query;

		const startDate = new Date();
		startDate.setDate(startDate.getDate() - Number(days));

		const checkIns = await SymptomCheckIn.find({
			patientId,
			checkInDate: { $gte: startDate },
		}).sort({ checkInDate: 1 });

		if (checkIns.length === 0) {
			return res.sendResponse({
				statusCode: 200,
				success: true,
				message: "No check-in data available for analysis",
				data: {
					trends: [],
					summary: {
						totalCheckIns: 0,
						averagePain: 0,
						averageTemp: 0,
						improvementTrend: "insufficient_data",
					},
				},
			});
		}

		// Calculate trends
		const painTrend = checkIns.map((c) => ({
			date: c.checkInDate,
			value: c.painLevel,
		}));

		const tempTrend = checkIns.map((c) => ({
			date: c.checkInDate,
			value: c.temperature,
		}));

		const moodTrend = checkIns.map((c) => ({
			date: c.checkInDate,
			value: c.mood,
		}));

		// Calculate averages
		const avgPain =
			checkIns.reduce((sum, c) => sum + c.painLevel, 0) / checkIns.length;
		const avgTemp =
			checkIns.reduce((sum, c) => sum + c.temperature, 0) /
			checkIns.length;

		// Determine improvement trend
		const recentCheckIns = checkIns.slice(-7); // Last 7 days
		const olderCheckIns = checkIns.slice(0, -7);

		let improvementTrend = "stable";
		if (recentCheckIns.length > 0 && olderCheckIns.length > 0) {
			const recentAvgPain =
				recentCheckIns.reduce((sum, c) => sum + c.painLevel, 0) /
				recentCheckIns.length;
			const olderAvgPain =
				olderCheckIns.reduce((sum, c) => sum + c.painLevel, 0) /
				olderCheckIns.length;

			if (recentAvgPain < olderAvgPain - 1) {
				improvementTrend = "improving";
			} else if (recentAvgPain > olderAvgPain + 1) {
				improvementTrend = "declining";
			}
		}

		return res.sendResponse({
			statusCode: 200,
			success: true,
			message: "Recovery trends retrieved successfully",
			data: {
				trends: {
					pain: painTrend,
					temperature: tempTrend,
					mood: moodTrend,
				},
				summary: {
					totalCheckIns: checkIns.length,
					averagePain: Math.round(avgPain * 10) / 10,
					averageTemp: Math.round(avgTemp * 10) / 10,
					improvementTrend,
				},
			},
		});
	}
);

// Get single check-in by ID
export const getCheckInById = asyncHandler(
	async (req: Request, res: Response) => {
		const { checkInId } = req.params;

		const checkIn = await SymptomCheckIn.findById(checkInId).populate(
			"patientId",
			"userId procedure procedureDate"
		);

		if (!checkIn) {
			throw new ApiError("Check-in not found", 404);
		}

		return res.sendResponse({
			statusCode: 200,
			success: true,
			message: "Check-in retrieved successfully",
			data: checkIn,
		});
	}
);
