import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Alert from "../models/Alert.js";
import SymptomCheckIn from "../models/SymptomCheckIn.js";
import Task from "../models/Task.js";
import Assignment from "../models/Assignment.js";
import User from "../models/User.js";

// Admin Dashboard Analytics
export const getAdminAnalytics = asyncHandler(
	async (req: Request, res: Response) => {
		const [
			totalPatients,
			activePatients,
			totalDoctors,
			totalAlerts,
			criticalAlerts,
			activeAlerts,
			totalCheckIns,
			recentPatients,
			recentAlerts,
		] = await Promise.all([
			Patient.countDocuments(),
			Patient.countDocuments({ status: "active" }),
			Doctor.countDocuments(),
			Alert.countDocuments(),
			Alert.countDocuments({ severity: "critical", status: "active" }),
			Alert.countDocuments({ status: "active" }),
			SymptomCheckIn.countDocuments(),
			Patient.find()
				.populate("userId", "firstName lastName email")
				.sort({ createdAt: -1 })
				.limit(5),
			Alert.find({ status: "active" })
				.populate("patientId", "userId procedure")
				.populate({
					path: "patientId",
					populate: {
						path: "userId",
						select: "firstName lastName",
					},
				})
				.sort({ createdAt: -1 })
				.limit(10),
		]);

		// Risk level distribution
		const [stablePatients, monitorPatients, criticalPatients] =
			await Promise.all([
				Patient.countDocuments({ riskLevel: "stable" }),
				Patient.countDocuments({ riskLevel: "monitor" }),
				Patient.countDocuments({ riskLevel: "critical" }),
			]);

		// Get check-in trends (last 30 days)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const checkInTrends = await SymptomCheckIn.aggregate([
			{
				$match: {
					checkInDate: { $gte: thirtyDaysAgo },
				},
			},
			{
				$group: {
					_id: {
						$dateToString: {
							format: "%Y-%m-%d",
							date: "$checkInDate",
						},
					},
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		return res.sendResponse({
			statusCode: 200,
			success: true,
			message: "Admin analytics retrieved successfully",
			data: {
				overview: {
					totalPatients,
					activePatients,
					recoveredPatients: totalPatients - activePatients,
					totalDoctors,
					totalAlerts,
					criticalAlerts,
					activeAlerts,
					totalCheckIns,
				},
				riskDistribution: {
					stable: stablePatients,
					monitor: monitorPatients,
					critical: criticalPatients,
				},
				checkInTrends,
				recentPatients,
				recentAlerts,
			},
		});
	}
);

// Doctor Dashboard Analytics
export const getDoctorAnalytics = asyncHandler(
	async (req: Request, res: Response) => {
		const doctorUserId = req.user?.id;

		// Find doctor document
		const doctor = await Doctor.findOne({ userId: doctorUserId });
		if (!doctor) {
			return res.sendResponse({
				statusCode: 200,
				success: true,
				message: "Doctor analytics retrieved successfully",
				data: {
					assignedPatients: [],
					totalAssignedPatients: 0,
					criticalPatients: 0,
					activeAlerts: 0,
					recentCheckIns: [],
				},
			});
		}

		// Get assigned patients
		const assignments = await Assignment.find({ doctorId: doctor._id });
		const patientIds = assignments.map((a) => a.patientId);

		const [
			assignedPatients,
			criticalPatients,
			activeAlerts,
			recentCheckIns,
		] = await Promise.all([
			Patient.find({ _id: { $in: patientIds } })
				.populate("userId", "firstName lastName email")
				.sort({ riskLevel: -1 }),
			Patient.countDocuments({
				_id: { $in: patientIds },
				riskLevel: "critical",
			}),
			Alert.find({
				patientId: { $in: patientIds },
				status: "active",
			})
				.populate("patientId", "userId procedure")
				.populate({
					path: "patientId",
					populate: {
						path: "userId",
						select: "firstName lastName",
					},
				})
				.sort({ severity: -1, createdAt: -1 })
				.limit(10),
			SymptomCheckIn.find({
				patientId: { $in: patientIds },
			})
				.populate("patientId", "userId procedure")
				.populate({
					path: "patientId",
					populate: {
						path: "userId",
						select: "firstName lastName",
					},
				})
				.sort({ checkInDate: -1 })
				.limit(10),
		]);

		// Risk distribution
		const riskDistribution = {
			stable: assignedPatients.filter((p) => p.riskLevel === "stable")
				.length,
			monitor: assignedPatients.filter((p) => p.riskLevel === "monitor")
				.length,
			critical: assignedPatients.filter((p) => p.riskLevel === "critical")
				.length,
		};

		return res.sendResponse({
			statusCode: 200,
			success: true,
			message: "Doctor analytics retrieved successfully",
			data: {
				assignedPatients,
				totalAssignedPatients: patientIds.length,
				criticalPatients,
				activeAlerts: activeAlerts.length,
				riskDistribution,
				recentAlerts: activeAlerts,
				recentCheckIns,
			},
		});
	}
);

// Patient Dashboard Analytics
export const getPatientAnalytics = asyncHandler(
	async (req: Request, res: Response) => {
		const patientUserId = req.user?.id;

		// Find patient document
		const patient = await Patient.findOne({
			userId: patientUserId,
		}).populate("userId", "firstName lastName email");
		if (!patient) {
			return res.sendResponse({
				statusCode: 200,
				success: true,
				message: "Patient analytics retrieved successfully",
				data: {
					patient: null,
					stats: {},
				},
			});
		}

		const [totalCheckIns, totalTasks, completedTasks, activeAlerts] =
			await Promise.all([
				SymptomCheckIn.countDocuments({ patientId: patient._id }),
				Task.countDocuments({ patientId: patient._id }),
				Task.countDocuments({
					patientId: patient._id,
					completed: true,
				}),
				Alert.countDocuments({
					patientId: patient._id,
					status: "active",
				}),
			]);

		// Get recent check-ins for trends
		const recentCheckIns = await SymptomCheckIn.find({
			patientId: patient._id,
		})
			.sort({ checkInDate: -1 })
			.limit(7);

		// Calculate adherence rate
		const adherenceRate =
			totalTasks > 0
				? Math.round((completedTasks / totalTasks) * 100)
				: 0;

		// Get assigned doctor
		const assignment = await Assignment.findOne({
			patientId: patient._id,
		}).populate({
			path: "doctorId",
			populate: {
				path: "userId",
				select: "firstName lastName email",
			},
		});

		// Calculate days post-op
		const daysPostOp = Math.floor(
			(Date.now() - new Date(patient.procedureDate).getTime()) /
				(1000 * 60 * 60 * 24)
		);

		return res.sendResponse({
			statusCode: 200,
			success: true,
			message: "Patient analytics retrieved successfully",
			data: {
				patient: {
					procedure: patient.procedure,
					procedureDate: patient.procedureDate,
					riskLevel: patient.riskLevel,
					status: patient.status,
					daysPostOp,
					_id: patient._id,
				},
				stats: {
					totalCheckIns,
					totalTasks,
					completedTasks,
					pendingTasks: totalTasks - completedTasks,
					adherenceRate,
					activeAlerts,
				},
				recentCheckIns,
				assignedDoctor: assignment?.doctorId,
			},
		});
	}
);

// System-wide statistics
export const getSystemStats = asyncHandler(
	async (req: Request, res: Response) => {
		const [
			totalUsers,
			totalPatients,
			totalDoctors,
			totalAdmins,
			totalAlerts,
			totalCheckIns,
			totalTasks,
		] = await Promise.all([
			User.countDocuments(),
			Patient.countDocuments(),
			Doctor.countDocuments(),
			User.countDocuments({ role: "admin" }),
			Alert.countDocuments(),
			SymptomCheckIn.countDocuments(),
			Task.countDocuments(),
		]);

		return res.sendResponse({
			statusCode: 200,
			success: true,
			message: "System statistics retrieved successfully",
			data: {
				users: {
					total: totalUsers,
					patients: totalPatients,
					doctors: totalDoctors,
					admins: totalAdmins,
				},
				activity: {
					totalAlerts,
					totalCheckIns,
					totalTasks,
				},
			},
		});
	}
);
