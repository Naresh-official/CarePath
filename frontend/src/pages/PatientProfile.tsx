import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { patientApi, medicationApi } from "@/lib/api";
import type { Patient, Medication, CreateMedicationData } from "@/lib/types";
import { formatDate } from "@/lib/formatDate";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function PatientProfile() {
	const { patientId } = useParams<{ patientId: string }>();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<
		"overview" | "symptoms" | "medications" | "notes"
	>("overview");

	const [patient, setPatient] = useState<Patient | null>(null);
	const [medications, setMedications] = useState<Medication[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Medication form state
	const [showMedicationForm, setShowMedicationForm] = useState(false);
	const [medicationForm, setMedicationForm] = useState<CreateMedicationData>({
		patientId: patientId || "",
		name: "",
		timings: [],
		foodRelation: "after",
		startDate: new Date().toISOString().split("T")[0],
		endDate: "",
		instructions: "",
		sideEffects: [],
	});
	const [editingMedicationId, setEditingMedicationId] = useState<
		string | null
	>(null);

	useEffect(() => {
		if (patientId) {
			fetchPatientData();
			fetchMedications();
		} else {
			setError("No patient ID provided");
			setLoading(false);
		}
	}, [patientId]);

	const fetchPatientData = async () => {
		try {
			setLoading(true);
			const response = await patientApi.getPatientDetails(patientId!);
			setPatient(response.data.data);
		} catch (err: unknown) {
			console.error("Error fetching patient:", err);
			setError(
				(err as any).response?.data?.message || "Failed to load patient"
			);
		} finally {
			setLoading(false);
		}
	};

	const fetchMedications = async () => {
		try {
			const response = await medicationApi.getPatientMedications(
				patientId!
			);
			setMedications(response.data.data || []);
		} catch (err: unknown) {
			console.error("Error fetching medications:", err);
		}
	};

	const handleCreateMedication = async () => {
		try {
			if (
				!medicationForm.name ||
				!medicationForm.timings.length ||
				!medicationForm.startDate
			) {
				alert(
					"Please fill in medication name, select at least one timing, and set start date"
				);
				return;
			}

			if (editingMedicationId) {
				// Update existing medication
				await medicationApi.updateMedication(
					editingMedicationId,
					medicationForm
				);
			} else {
				// Create new medication
				await medicationApi.createMedication(medicationForm);
			}

			// Reset form and refresh medications
			setShowMedicationForm(false);
			setEditingMedicationId(null);
			setMedicationForm({
				patientId: patientId || "",
				name: "",
				timings: [],
				foodRelation: "after",
				startDate: new Date().toISOString().split("T")[0],
				endDate: "",
				instructions: "",
				sideEffects: [],
			});
			fetchMedications();
		} catch (err: unknown) {
			console.error("Error saving medication:", err);
			alert(
				(err as any).response?.data?.message ||
					"Failed to save medication"
			);
		}
	};

	const handleEditMedication = (medication: Medication) => {
		setEditingMedicationId(medication._id);
		setMedicationForm({
			patientId: patientId || "",
			name: medication.name,
			timings: medication.timings,
			foodRelation: medication.foodRelation,
			startDate: new Date(medication.startDate)
				.toISOString()
				.split("T")[0],
			endDate: medication.endDate
				? new Date(medication.endDate).toISOString().split("T")[0]
				: "",
			instructions: medication.instructions || "",
			sideEffects: medication.sideEffects || [],
		});
		setShowMedicationForm(true);
	};

	const handleDeleteMedication = async (medicationId: string) => {
		if (!confirm("Are you sure you want to delete this medication?")) {
			return;
		}

		try {
			await medicationApi.deleteMedication(medicationId);
			fetchMedications();
		} catch (err: unknown) {
			console.error("Error deleting medication:", err);
			alert(
				(err as any).response?.data?.message ||
					"Failed to delete medication"
			);
		}
	};

	const calculateTrackingDuration = (medication: Medication): string => {
		const start = new Date(medication.startDate);
		const end = medication.endDate
			? new Date(medication.endDate)
			: new Date();
		const diffTime = Math.abs(end.getTime() - start.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (medication.endDate) {
			return `${diffDays} days (completed)`;
		} else {
			return `${diffDays} days (ongoing)`;
		}
	};

	if (loading) {
		return (
			<div className="p-4 md:p-6">
				<p className="text-muted-foreground">Loading patient data...</p>
			</div>
		);
	}

	if (error || !patient) {
		return (
			<div className="p-4 md:p-6">
				<Card className="p-4 bg-red-50 border-red-200">
					<p className="text-red-800">
						{error || "Patient not found"}
					</p>
					<Button
						size="sm"
						variant="outline"
						onClick={() => navigate("/doctor/dashboard")}
						className="mt-2"
					>
						Back to Dashboard
					</Button>
				</Card>
			</div>
		);
	}

	const patientName = `${patient.userId.firstName} ${patient.userId.lastName}`;

	return (
		<div className="p-4 md:p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						{patientName}
					</h1>
					<p className="text-muted-foreground">{patient.procedure}</p>
				</div>
				<span
					className={`px-4 py-2 rounded-full font-medium w-fit ${
						patient.riskLevel === "stable"
							? "bg-green-100 text-green-800"
							: patient.riskLevel === "monitor"
							? "bg-yellow-100 text-yellow-800"
							: "bg-red-100 text-red-800"
					}`}
				>
					{patient.riskLevel.charAt(0).toUpperCase() +
						patient.riskLevel.slice(1)}
				</span>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card className="p-4">
					<p className="text-sm text-muted-foreground">Age</p>
					<p className="text-2xl font-bold text-foreground">
						{patient.age}
					</p>
				</Card>
				<Card className="p-4">
					<p className="text-sm text-muted-foreground">
						Days Post-Op
					</p>
					<p className="text-2xl font-bold text-foreground">
						Day {patient.daysPostOp}
					</p>
				</Card>
				<Card className="p-4">
					<p className="text-sm text-muted-foreground">Adherence</p>
					<p className="text-2xl font-bold text-foreground">
						{patient.adherenceRate}%
					</p>
				</Card>
				<Card className="p-4">
					<p className="text-sm text-muted-foreground">Status</p>
					<p className="text-lg font-semibold text-foreground capitalize">
						{patient.status}
					</p>
				</Card>
			</div>

			{/* Contact Information */}
			<Card className="p-4 space-y-2">
				<h3 className="font-semibold text-foreground">
					Contact Information
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
					<div>
						<p className="text-muted-foreground">Phone</p>
						<p className="font-medium text-foreground">
							{patient.phone || "Not provided"}
						</p>
					</div>
					<div>
						<p className="text-muted-foreground">Email</p>
						<p className="font-medium text-foreground">
							{patient.userId.email}
						</p>
					</div>
				</div>
			</Card>

			{/* Tabs */}
			<div className="flex gap-2 border-b border-border overflow-x-auto">
				{(
					["overview", "symptoms", "medications", "notes"] as const
				).map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
							activeTab === tab
								? "text-primary border-b-2 border-primary"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						{tab.charAt(0).toUpperCase() + tab.slice(1)}
					</button>
				))}
			</div>

			{/* Tab Content */}
			<div className="space-y-4">
				{activeTab === "overview" && (
					<div className="space-y-4">
						<Card className="p-6 space-y-4">
							<h2 className="font-semibold text-lg text-foreground">
								Patient Overview
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">
										Procedure Date
									</p>
									<p className="font-medium text-foreground">
										{formatDate(patient.procedureDate)}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Recovery Progress
									</p>
									<p className="font-medium text-foreground">
										{patient.recoveryProgress}%
									</p>
								</div>
							</div>
						</Card>
					</div>
				)}

				{activeTab === "symptoms" && (
					<div className="space-y-4">
						<Card className="p-6 space-y-4">
							<h2 className="font-semibold text-lg text-foreground">
								Symptom History
							</h2>
							<p className="text-sm text-muted-foreground">
								Symptom tracking coming soon...
							</p>
						</Card>
					</div>
				)}

				{activeTab === "medications" && (
					<div className="space-y-4">
						<Card className="p-6 space-y-4">
							<div className="flex justify-between items-center">
								<h2 className="font-semibold text-lg text-foreground">
									Current Medications
								</h2>
								<Button
									size="sm"
									onClick={() => {
										setShowMedicationForm(
											!showMedicationForm
										);
										setEditingMedicationId(null);
										setMedicationForm({
											patientId: patientId || "",
											name: "",
											timings: [],
											foodRelation: "after",
											startDate: new Date()
												.toISOString()
												.split("T")[0],
											endDate: "",
											instructions: "",
											sideEffects: [],
										});
									}}
								>
									{showMedicationForm
										? "Cancel"
										: "Add Medication"}
								</Button>
							</div>

							{/* Medication Form */}
							{showMedicationForm && (
								<Card className="p-4 bg-muted/30 space-y-4">
									<h3 className="font-medium text-foreground">
										{editingMedicationId ? "Edit" : "New"}{" "}
										Medication
									</h3>
									<div className="grid grid-cols-1 gap-4">
										<div>
											<Label htmlFor="name">
												Medication Name (include dosage)
												*
											</Label>
											<Input
												id="name"
												value={medicationForm.name}
												onChange={(e) =>
													setMedicationForm({
														...medicationForm,
														name: e.target.value,
													})
												}
												placeholder="e.g., Ibuprofen 400mg"
											/>
											<p className="text-xs text-muted-foreground mt-1">
												Include the dosage in the name
												(e.g., "Aspirin 500mg",
												"Metformin 2 tablets")
											</p>
										</div>

										<div className="space-y-3">
											<Label>
												Timing (select all that apply) *
											</Label>
											<div className="flex flex-col space-y-2">
												{(
													[
														"morning",
														"afternoon",
														"night",
													] as const
												).map((time) => (
													<div
														key={time}
														className="flex items-center space-x-2"
													>
														<Checkbox
															id={time}
															checked={medicationForm.timings.some(
																(t) =>
																	t.timeOfDay ===
																	time
															)}
															onCheckedChange={(
																checked
															) => {
																if (checked) {
																	setMedicationForm(
																		{
																			...medicationForm,
																			timings:
																				[
																					...medicationForm.timings,
																					{
																						timeOfDay:
																							time,
																					},
																				],
																		}
																	);
																} else {
																	setMedicationForm(
																		{
																			...medicationForm,
																			timings:
																				medicationForm.timings.filter(
																					(
																						t
																					) =>
																						t.timeOfDay !==
																						time
																				),
																		}
																	);
																}
															}}
														/>
														<label
															htmlFor={time}
															className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
														>
															{time}
														</label>
													</div>
												))}
											</div>
										</div>

										<div className="space-y-3">
											<Label>Food Relation *</Label>
											<RadioGroup
												value={
													medicationForm.foodRelation
												}
												onValueChange={(
													value:
														| "before"
														| "after"
														| "with"
														| "empty_stomach"
												) =>
													setMedicationForm({
														...medicationForm,
														foodRelation: value,
													})
												}
											>
												<div className="flex items-center space-x-2">
													<RadioGroupItem
														value="before"
														id="before"
													/>
													<Label
														htmlFor="before"
														className="font-normal cursor-pointer"
													>
														Before food
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem
														value="after"
														id="after"
													/>
													<Label
														htmlFor="after"
														className="font-normal cursor-pointer"
													>
														After food
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem
														value="with"
														id="with"
													/>
													<Label
														htmlFor="with"
														className="font-normal cursor-pointer"
													>
														With food
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem
														value="empty_stomach"
														id="empty_stomach"
													/>
													<Label
														htmlFor="empty_stomach"
														className="font-normal cursor-pointer"
													>
														On empty stomach
													</Label>
												</div>
											</RadioGroup>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor="startDate">
													Start Date *
												</Label>
												<Input
													id="startDate"
													type="date"
													value={
														medicationForm.startDate
													}
													onChange={(e) =>
														setMedicationForm({
															...medicationForm,
															startDate:
																e.target.value,
														})
													}
												/>
											</div>
											<div>
												<Label htmlFor="endDate">
													End Date (Optional)
												</Label>
												<Input
													id="endDate"
													type="date"
													value={
														medicationForm.endDate
													}
													onChange={(e) =>
														setMedicationForm({
															...medicationForm,
															endDate:
																e.target.value,
														})
													}
												/>
											</div>
										</div>
									</div>
									<div>
										<Label htmlFor="instructions">
											Additional Instructions
										</Label>
										<Textarea
											id="instructions"
											value={medicationForm.instructions}
											onChange={(
												e: React.ChangeEvent<HTMLTextAreaElement>
											) =>
												setMedicationForm({
													...medicationForm,
													instructions:
														e.target.value,
												})
											}
											placeholder="Any additional instructions..."
											rows={3}
										/>
									</div>
									<Button onClick={handleCreateMedication}>
										{editingMedicationId ? "Update" : "Add"}{" "}
										Medication
									</Button>
								</Card>
							)}

							{/* Medications List */}
							<div className="space-y-3">
								{medications.length === 0 ? (
									<p className="text-sm text-muted-foreground text-center py-8">
										No medications added yet
									</p>
								) : (
									medications.map((med) => (
										<div
											key={med._id}
											className="p-4 border border-border rounded-lg"
										>
											<div className="flex justify-between items-start mb-2">
												<div className="flex-1">
													<p className="font-semibold text-foreground">
														{med.name}
													</p>
													<p className="text-sm text-muted-foreground">
														{med.timings
															.map(
																(t) =>
																	t.timeOfDay
															)
															.join(", ")}{" "}
														•{" "}
														{med.foodRelation ===
														"before"
															? "Before food"
															: med.foodRelation ===
															  "after"
															? "After food"
															: med.foodRelation ===
															  "with"
															? "With food"
															: "On empty stomach"}
													</p>
													<p className="text-xs text-muted-foreground mt-1">
														{med.timings.length ===
														1
															? "1 time"
															: `${med.timings.length} times`}{" "}
														per day
													</p>
													<p className="text-xs text-muted-foreground mt-1">
														Tracking:{" "}
														{calculateTrackingDuration(
															med
														)}
													</p>
													{med.instructions && (
														<p className="text-xs text-muted-foreground mt-1">
															Instructions:{" "}
															{med.instructions}
														</p>
													)}
												</div>
												<div className="flex flex-col items-end gap-2">
													<span className="text-sm font-medium text-primary">
														{med.adherenceRate}%
														adherence
													</span>
													<div className="flex gap-2">
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																handleEditMedication(
																	med
																)
															}
														>
															Edit
														</Button>
														<Button
															size="sm"
															variant="destructive"
															onClick={() =>
																handleDeleteMedication(
																	med._id
																)
															}
														>
															Delete
														</Button>
													</div>
												</div>
											</div>
											<div className="w-full bg-muted rounded-full h-2 overflow-hidden">
												<div
													className="bg-primary h-full transition-all"
													style={{
														width: `${med.adherenceRate}%`,
													}}
												/>
											</div>
										</div>
									))
								)}
							</div>
						</Card>
					</div>
				)}

				{activeTab === "notes" && (
					<div className="space-y-4">
						<Card className="p-6 space-y-4">
							<div className="flex justify-between items-center">
								<h2 className="font-semibold text-lg text-foreground">
									Clinical Notes
								</h2>
								<Button size="sm">Add Note</Button>
							</div>
							<p className="text-sm text-muted-foreground">
								Clinical notes coming soon...
							</p>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
}

export default PatientProfile;
