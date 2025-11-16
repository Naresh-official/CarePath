import { Router } from "express";
import {
	createCallRoom,
	joinCallRoom,
	endCall,
	getCallSession,
	sendSignal,
} from "../controllers/video-call.controller.js";

const router = Router();

router.post("/create-room", createCallRoom);
router.get("/join/:roomId", joinCallRoom);
router.post("/end/:roomId", endCall);
router.get("/session/:roomId", getCallSession);
router.post("/signal", sendSignal);

export default router;
