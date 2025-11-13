import { Router } from "express";
import {
	addPatient,
	deletePatient,
	getAllPatients,
	getPatientById,
	seedPatients,
	updatePatient,
} from "../controllers/patient-management.controller.js";

const router = Router();

router.get("/patients", getAllPatients);
router.get("/patient/:patientId", getPatientById);
router.post("/patient", addPatient);
router.patch("/patient/:patientId", updatePatient);
router.delete("/patient/:patientId", deletePatient);

router.post("/seed-patients", seedPatients);

export default router;
