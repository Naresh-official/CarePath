import { Router } from "express";
import {
	createNote,
	getPatientNotes,
	getNoteById,
	updateNote,
	deleteNote,
} from "../controllers/note.controller.js";
import { getDoctorAnalytics } from "../controllers/analytics.controller.js";
import { getPatientById } from "../controllers/patient-management.controller.js";

const router = Router();

// Doctor Notes
router.post("/note", createNote);
router.get("/notes/:patientId", getPatientNotes);
router.get("/note/:noteId", getNoteById);
router.patch("/note/:noteId", updateNote);
router.delete("/note/:noteId", deleteNote);

// Analytics
router.get("/analytics", getDoctorAnalytics);

// Patient Details View
router.get("/patient/:patientId", getPatientById);

export default router;
