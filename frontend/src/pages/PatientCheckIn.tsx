import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { patientApi } from "@/lib/api";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { SymptomCheckIn } from "@/lib/types";

function PatientCheckIn() {
	const { user } = useAuth();

	const [formData, setFormData] = useState({
		painLevel: 0,
		temperature: 37,
		bloodPressure: "120/80",
		mood: "good",
		notes: "",
	});

	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const [checkInHistory, setCheckInHistory] = useState<SymptomCheckIn[]>([]);
	const [historyLoading, setHistoryLoading] = useState(true);

	const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

	const availableSymptoms = [
		"Fatigue",
		"Nausea",
		"Dizziness",
		"Headache",
		"Shortness of breath",
		"Loss of appetite",
		"Insomnia",
		"Muscle aches",
	];

	// -------------------------------
	// Fetch history
	// -------------------------------

	const fetchCheckInHistory = useCallback(async () => {
		if (!user?._id) return;

		try {
			setHistoryLoading(true);
			const { data } = await patientApi.getCheckIns(user._id, {
				page: 1,
				limit: 10,
			});

			setCheckInHistory(data?.data?.checkIns || data?.data || []);
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(
					error.response?.data?.message ||
						"Failed to load check-in history"
				);
			}
		} finally {
			setHistoryLoading(false);
		}
	}, [user?._id]);

	useEffect(() => {
		if (user?._id) fetchCheckInHistory();
	}, [user?._id, fetchCheckInHistory]);

	// -------------------------------
	// Submit handler
	// -------------------------------

	const handleSubmit = async () => {
		if (!user?._id) {
			toast.error("User not found");
			return;
		}

		if (formData.temperature < 30 || formData.temperature > 45) {
			toast.error("Temperature must be between 30–45°C");
			return;
		}

		if (formData.painLevel < 0 || formData.painLevel > 10) {
			toast.error("Pain level must be between 0–10");
			return;
		}

		try {
			setLoading(true);

			// Parse blood pressure string (e.g., "120/80") into systolic/diastolic
			const bpParts = formData.bloodPressure.split("/");
			const systolic = parseInt(bpParts[0]?.trim() || "0", 10);
			const diastolic = parseInt(bpParts[1]?.trim() || "0", 10);

			const payload = {
				patientId: user._id,
				painLevel: formData.painLevel,
				temperature: formData.temperature,
				bloodPressure: {
					systolic,
					diastolic,
				},
				mood: formData.mood as "poor" | "okay" | "good" | "excellent",
				notes: formData.notes,
				symptoms: selectedSymptoms.map((symptom) => ({
					type: symptom,
					description: symptom,
				})),
			};

			const { data } = await patientApi.submitCheckIn(payload);

			if (data.success) {
				toast.success("Check-in submitted successfully!");

				const responseData = data.data as {
					checkIn?: SymptomCheckIn;
					riskLevel?: string;
					flaggedForReview?: boolean;
				};
				const checkIn = responseData?.checkIn || responseData;

				if (checkIn?.riskLevel || responseData?.riskLevel) {
					const riskLevel =
						checkIn?.riskLevel || responseData?.riskLevel;
					toast.info(`AI Analysis: ${riskLevel} risk level`);
				}

				// Reset form
				setFormData({
					painLevel: 0,
					temperature: 37,
					bloodPressure: "120/80",
					mood: "good",
					notes: "",
				});
				setSelectedSymptoms([]);

				setSubmitted(true);
				setTimeout(() => setSubmitted(false), 2500);

				await fetchCheckInHistory();
			}
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(
					error.response?.data?.message || "Failed to submit check-in"
				);
			}
		} finally {
			setLoading(false);
		}
	};

	// -------------------------------
	// Alerts
	// -------------------------------

	const alerts = [];
	if (formData.temperature > 38) {
		alerts.push("High fever detected. Contact your care team.");
	}
	if (formData.painLevel > 8) {
		alerts.push("Severe pain reported. Consider pain management options.");
	}

	// -------------------------------
	// Helpers
	// -------------------------------

	const toggleSymptom = (symptom: string) => {
		setSelectedSymptoms((prev) =>
			prev.includes(symptom)
				? prev.filter((s) => s !== symptom)
				: [...prev, symptom]
		);
	};

	const getRiskBadgeColor = (risk?: string) => {
		switch (risk) {
			case "Critical":
				return "bg-red-100 text-red-800 border-red-200";
			case "Warning":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "Normal":
				return "bg-green-100 text-green-800 border-green-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	// -------------------------------
	// UI
	// -------------------------------

	return (
		<div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
			<h1 className="text-3xl font-bold">Symptom Check-in</h1>

			{/* Alerts */}
			{alerts.length > 0 && (
				<div className="space-y-2">
					{alerts.map((msg, index) => (
						<div
							key={index}
							className="p-4 bg-red-50 border border-red-200 rounded-lg"
						>
							<p className="text-sm font-medium text-red-800">
								{msg}
							</p>
						</div>
					))}
				</div>
			)}

			{submitted && (
				<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
					<p className="text-sm font-medium text-green-800">
						Check-in submitted successfully!
					</p>
				</div>
			)}

			{/* Form */}
			<Card className="p-6 space-y-6">
				{/* Pain */}
				<div className="space-y-3">
					<label className="font-semibold">
						Pain Level: {formData.painLevel}/10
					</label>
					<input
						type="range"
						min={0}
						max={10}
						value={formData.painLevel}
						onChange={(e) =>
							setFormData((p) => ({
								...p,
								painLevel: Number(e.target.value),
							}))
						}
						className="w-full h-2 bg-muted rounded-lg cursor-pointer"
					/>
					<div className="flex justify-between text-xs text-muted-foreground">
						<span>No Pain</span>
						<span>Severe Pain</span>
					</div>
				</div>

				{/* Temperature */}
				<div className="space-y-2">
					<label className="font-semibold">Temperature (°C)</label>
					<input
						type="number"
						step={0.1}
						value={formData.temperature}
						min={30}
						max={45}
						onChange={(e) =>
							setFormData((p) => ({
								...p,
								temperature: Number(e.target.value),
							}))
						}
						className="w-full px-3 py-2 border rounded-lg bg-input"
					/>
				</div>

				{/* Blood Pressure */}
				<div className="space-y-2">
					<label className="font-semibold">
						Blood Pressure (mmHg)
					</label>
					<input
						type="text"
						value={formData.bloodPressure}
						onChange={(e) =>
							setFormData((p) => ({
								...p,
								bloodPressure: e.target.value,
							}))
						}
						className="w-full px-3 py-2 border rounded-lg bg-input"
					/>
				</div>

				{/* Mood */}
				<div className="space-y-3">
					<label className="font-semibold">
						How are you feeling?
					</label>
					<div className="grid grid-cols-3 gap-2">
						{["poor", "okay", "good"].map((mood) => (
							<button
								key={mood}
								type="button"
								onClick={() =>
									setFormData((p) => ({ ...p, mood }))
								}
								className={`p-3 rounded-lg border-2 capitalize font-medium transition-all ${
									formData.mood === mood
										? "border-primary bg-primary/10 text-primary"
										: "border-border text-muted-foreground hover:border-primary/50"
								}`}
							>
								{mood}
							</button>
						))}
					</div>
				</div>

				{/* Symptoms */}
				<div className="space-y-3">
					<label className="font-semibold">
						Symptoms (Select all that apply)
					</label>
					<div className="grid grid-cols-2 gap-2">
						{availableSymptoms.map((symptom) => (
							<button
								key={symptom}
								type="button"
								onClick={() => toggleSymptom(symptom)}
								className={`p-2 rounded-lg border-2 text-sm transition-all ${
									selectedSymptoms.includes(symptom)
										? "border-primary bg-primary/10 text-primary"
										: "border-border text-muted-foreground hover:border-primary/50"
								}`}
							>
								{symptom}
							</button>
						))}
					</div>
				</div>

				{/* Notes */}
				<div className="space-y-2">
					<label className="font-semibold">Additional Notes</label>
					<textarea
						value={formData.notes}
						onChange={(e) =>
							setFormData((p) => ({
								...p,
								notes: e.target.value,
							}))
						}
						className="w-full px-3 py-2 border rounded-lg bg-input min-h-24 resize-none"
						placeholder="Any other symptoms or concerns?"
					/>
				</div>

				{/* Button */}
				<Button
					className="w-full"
					size="lg"
					onClick={handleSubmit}
					disabled={loading}
				>
					{loading ? "Submitting..." : "Submit Check-in"}
				</Button>
			</Card>

			{/* History */}
			<div className="space-y-3">
				<h2 className="font-semibold text-lg">Recent Check-ins</h2>

				{historyLoading ? (
					<div className="space-y-2">
						{[1, 2, 3].map((i) => (
							<Card key={i} className="p-4 space-y-3">
								<Skeleton className="h-4 w-48" />
								<Skeleton className="h-16 w-full" />
							</Card>
						))}
					</div>
				) : checkInHistory.length === 0 ? (
					<Card className="p-6 text-center text-muted-foreground">
						No check-ins yet. Submit your first check-in above!
					</Card>
				) : (
					<div className="space-y-2">
						{checkInHistory.map((checkin) => (
							<Card key={checkin._id} className="p-4 space-y-2">
								<div className="flex justify-between items-start">
									<p className="text-sm text-muted-foreground">
										{new Date(
											checkin.checkInDate ||
												checkin.date ||
												checkin.createdAt
										).toLocaleString()}
									</p>
									<span
										className={`text-xs px-2 py-1 rounded-md border ${getRiskBadgeColor(
											checkin.riskLevel
										)}`}
									>
										{checkin.riskLevel || "Logged"}
									</span>
								</div>

								<div className="grid grid-cols-3 gap-2 text-sm">
									<div>
										<p className="text-muted-foreground">
											Pain
										</p>
										<p className="font-semibold">
											{checkin.painLevel}/10
										</p>
									</div>
									<div>
										<p className="text-muted-foreground">
											Temp
										</p>
										<p className="font-semibold">
											{checkin.temperature}°C
										</p>
									</div>
									<div>
										<p className="text-muted-foreground">
											BP
										</p>
										<p className="font-semibold">
											{checkin.bloodPressure?.formatted ||
												(checkin.bloodPressure
													?.systolic &&
												checkin.bloodPressure?.diastolic
													? `${checkin.bloodPressure.systolic}/${checkin.bloodPressure.diastolic}`
													: "N/A")}
										</p>
									</div>
								</div>

								<div className="text-sm">
									<p className="text-muted-foreground">
										Mood
									</p>
									<p className="font-semibold capitalize">
										{checkin.mood}
									</p>
								</div>

								{checkin.symptoms &&
									checkin.symptoms.length > 0 && (
										<div className="text-sm">
											<p className="text-muted-foreground">
												Symptoms
											</p>
											<p className="font-semibold">
												{checkin.symptoms
													.map(
														(s) =>
															s.type ||
															s.description
													)
													.filter(Boolean)
													.join(", ")}
											</p>
										</div>
									)}

								{checkin.notes && (
									<p className="text-sm text-muted-foreground italic">
										"{checkin.notes}"
									</p>
								)}
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default PatientCheckIn;
