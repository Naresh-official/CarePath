import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { validateRequest } from "../utils/validation.js";
import mongoose from "mongoose";

// Simple in-memory store for video call sessions (use Redis in production)
const activeCallSessions = new Map<
	string,
	{
		roomId: string;
		participants: string[];
		startedAt: Date;
		status: "waiting" | "active" | "ended";
	}
>();

// Create a video call room
export const createCallRoom = asyncHandler(
	async (req: Request, res: Response) => {
		const { participantId } = req.body;

		validateRequest([
			{
				field: "participantId",
				value: participantId,
				rules: { required: true, type: "string" },
			},
		]);

		const userId = req.user?.id;
		if (!userId) {
			throw new ApiError("Unauthorized", 401);
		}

		// Generate unique room ID
		const roomId = `room-${userId}-${participantId}-${Date.now()}`;

		// Create call session
		activeCallSessions.set(roomId, {
			roomId,
			participants: [userId, participantId],
			startedAt: new Date(),
			status: "waiting",
		});

		return res.sendResponse({
			statusCode: 201,
			success: true,
			message: "Video call room created successfully",
			data: {
				roomId,
				participants: [userId, participantId],
			},
		});
	}
);

// Join a video call room
export const joinCallRoom = asyncHandler(
	async (req: Request, res: Response) => {
		const { roomId } = req.params;

		const session = activeCallSessions.get(roomId);
		if (!session) {
			throw new ApiError("Call room not found or expired", 404);
		}

		const userId = req.user?.id;
		if (!userId) {
			throw new ApiError("Unauthorized", 401);
		}

		// Check if user is a participant
		if (!session.participants.includes(userId)) {
			throw new ApiError("Not authorized to join this call", 403);
		}

		// Update status to active
		session.status = "active";

		return res.sendResponse({
			statusCode: 200,
			success: true,
			message: "Joined video call room successfully",
			data: {
				roomId: session.roomId,
				participants: session.participants,
				status: session.status,
			},
		});
	}
);

// End video call
export const endCall = asyncHandler(async (req: Request, res: Response) => {
	const { roomId } = req.params;

	const session = activeCallSessions.get(roomId);
	if (!session) {
		throw new ApiError("Call room not found", 404);
	}

	const userId = req.user?.id;
	if (!userId || !session.participants.includes(userId)) {
		throw new ApiError("Unauthorized to end this call", 403);
	}

	// Mark as ended
	session.status = "ended";

	// Remove from active sessions after 5 minutes
	setTimeout(() => {
		activeCallSessions.delete(roomId);
	}, 5 * 60 * 1000);

	return res.sendResponse({
		statusCode: 200,
		success: true,
		message: "Video call ended successfully",
		data: {
			roomId,
			duration: Date.now() - session.startedAt.getTime(),
		},
	});
});

// Get call session details
export const getCallSession = asyncHandler(
	async (req: Request, res: Response) => {
		const { roomId } = req.params;

		const session = activeCallSessions.get(roomId);
		if (!session) {
			throw new ApiError("Call room not found", 404);
		}

		return res.sendResponse({
			statusCode: 200,
			success: true,
			message: "Call session retrieved successfully",
			data: session,
		});
	}
);

// WebRTC Signaling endpoints (for peer connection)
export const sendSignal = asyncHandler(async (req: Request, res: Response) => {
	const { roomId, signal, targetUserId } = req.body;

	validateRequest([
		{
			field: "roomId",
			value: roomId,
			rules: { required: true, type: "string" },
		},
		{
			field: "signal",
			value: signal,
			rules: { required: true, type: "object" },
		},
		{
			field: "targetUserId",
			value: targetUserId,
			rules: { required: true, type: "string" },
		},
	]);

	// In a real application, this would use WebSocket/Socket.IO
	// For now, just acknowledge the signal
	// TODO: Implement real-time signaling with Socket.IO

	return res.sendResponse({
		statusCode: 200,
		success: true,
		message: "Signal sent successfully",
		data: {
			roomId,
			from: req.user?.id,
			to: targetUserId,
		},
	});
});
