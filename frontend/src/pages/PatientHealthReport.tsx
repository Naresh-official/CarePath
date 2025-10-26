import { useState } from "react";

function PatientHealthReport() {
	const [selectedReport, setSelectedReport] = useState<"health" | "medical">(
		"health"
	);

	const healthReportData = {
		date: "2024-01-20",
		patientName: "John Smith",
		procedure: "Knee Replacement Surgery",
		procedureDate: "2024-01-10",
		recoveryProgress: 75,
		metrics: [
			{ label: "Pain Level", value: "3/10", status: "improving" },
			{ label: "Mobility", value: "Good", status: "improving" },
			{ label: "Swelling", value: "Minimal", status: "improving" },
			{
				label: "Medication Adherence",
				value: "95%",
				status: "excellent",
			},
		],
		milestones: [
			{
				date: "2024-01-10",
				milestone: "Surgery Completed",
				completed: true,
			},
			{
				date: "2024-01-12",
				milestone: "First Physical Therapy",
				completed: true,
			},
			{
				date: "2024-01-15",
				milestone: "Weight Bearing Exercises",
				completed: true,
			},
			{
				date: "2024-01-25",
				milestone: "Return to Light Activities",
				completed: false,
			},
		],
	};

	const medicalReportData = {
		date: "2024-01-20",
		patientName: "John Smith",
		procedure: "Knee Replacement Surgery",
		surgeon: "Dr. Sarah Johnson",
		anesthesiologist: "Dr. Michael Chen",
		operativeNotes:
			"Successful total knee replacement performed under general anesthesia. Implant positioned correctly. No complications noted.",
		postOpInstructions: [
			"Keep incision clean and dry",
			"Take prescribed medications as directed",
			"Perform physical therapy exercises daily",
			"Avoid strenuous activities for 6 weeks",
			"Attend follow-up appointments",
		],
		medications: [
			{
				name: "Ibuprofen",
				dosage: "400mg",
				frequency: "Every 6 hours",
				duration: "2 weeks",
			},
			{
				name: "Amoxicillin",
				dosage: "500mg",
				frequency: "Every 8 hours",
				duration: "7 days",
			},
			{
				name: "Metformin",
				dosage: "500mg",
				frequency: "Twice daily",
				duration: "Ongoing",
			},
		],
		followUpSchedule: [
			{
				date: "2024-02-10",
				type: "Surgeon Follow-up",
				location: "Orthopedic Clinic",
			},
			{
				date: "2024-02-15",
				type: "Physical Therapy",
				location: "PT Center",
			},
			{
				date: "2024-03-10",
				type: "Final Check-up",
				location: "Orthopedic Clinic",
			},
		],
	};

	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="max-w-4xl mx-auto p-4 md:p-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
				<h1 className="text-3xl font-bold text-foreground">
					Health & Medical Reports
				</h1>
				<button
					onClick={handlePrint}
					className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors print:hidden"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H9a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2h-2m-4-4V9m0 4v6m0-6H9m4 0h4"
						/>
					</svg>
					Print Report
				</button>
			</div>

			{/* Report Type Selector */}
			<div className="flex gap-2 mb-6 border-b border-border">
				<button
					onClick={() => setSelectedReport("health")}
					className={`px-4 py-3 font-medium transition-colors ${
						selectedReport === "health"
							? "text-primary border-b-2 border-primary"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					Patient Health Report
				</button>
				<button
					onClick={() => setSelectedReport("medical")}
					className={`px-4 py-3 font-medium transition-colors ${
						selectedReport === "medical"
							? "text-primary border-b-2 border-primary"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					Medical Report
				</button>
			</div>

			{/* Patient Health Report */}
			{selectedReport === "health" && (
				<div className="space-y-6 bg-card rounded-lg p-6 border border-border">
					<div className="grid grid-cols-2 gap-4 pb-6 border-b border-border">
						<div>
							<p className="text-sm text-muted-foreground">
								Patient Name
							</p>
							<p className="text-lg font-semibold text-foreground">
								{healthReportData.patientName}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Report Date
							</p>
							<p className="text-lg font-semibold text-foreground">
								{healthReportData.date}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Procedure
							</p>
							<p className="text-lg font-semibold text-foreground">
								{healthReportData.procedure}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Procedure Date
							</p>
							<p className="text-lg font-semibold text-foreground">
								{healthReportData.procedureDate}
							</p>
						</div>
					</div>

					{/* Recovery Progress */}
					<div>
						<h3 className="text-xl font-semibold text-foreground mb-4">
							Recovery Progress
						</h3>
						<div className="mb-2 flex justify-between">
							<span className="text-sm font-medium text-foreground">
								Overall Recovery
							</span>
							<span className="text-sm font-medium text-primary">
								{healthReportData.recoveryProgress}%
							</span>
						</div>
						<div className="w-full bg-muted rounded-full h-3">
							<div
								className="bg-primary h-3 rounded-full transition-all"
								style={{
									width: `${healthReportData.recoveryProgress}%`,
								}}
							/>
						</div>
					</div>

					{/* Health Metrics */}
					<div>
						<h3 className="text-xl font-semibold text-foreground mb-4">
							Health Metrics
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{healthReportData.metrics.map((metric, idx) => (
								<div
									key={idx}
									className="p-4 bg-muted rounded-lg"
								>
									<p className="text-sm text-muted-foreground">
										{metric.label}
									</p>
									<p className="text-lg font-semibold text-foreground">
										{metric.value}
									</p>
									<p className="text-xs text-accent mt-1 capitalize">
										{metric.status}
									</p>
								</div>
							))}
						</div>
					</div>

					{/* Recovery Milestones */}
					<div>
						<h3 className="text-xl font-semibold text-foreground mb-4">
							Recovery Milestones
						</h3>
						<div className="space-y-3">
							{healthReportData.milestones.map(
								(milestone, idx) => (
									<div
										key={idx}
										className="flex items-start gap-3 p-3 bg-muted rounded-lg"
									>
										<div
											className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
												milestone.completed
													? "bg-accent text-white"
													: "bg-border"
											}`}
										>
											{milestone.completed && (
												<span className="text-sm">
													✓
												</span>
											)}
										</div>
										<div>
											<p className="font-medium text-foreground">
												{milestone.milestone}
											</p>
											<p className="text-sm text-muted-foreground">
												{milestone.date}
											</p>
										</div>
									</div>
								)
							)}
						</div>
					</div>
				</div>
			)}

			{/* Medical Report */}
			{selectedReport === "medical" && (
				<div className="space-y-6 bg-card rounded-lg p-6 border border-border">
					<div className="grid grid-cols-2 gap-4 pb-6 border-b border-border">
						<div>
							<p className="text-sm text-muted-foreground">
								Patient Name
							</p>
							<p className="text-lg font-semibold text-foreground">
								{medicalReportData.patientName}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Report Date
							</p>
							<p className="text-lg font-semibold text-foreground">
								{medicalReportData.date}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Surgeon
							</p>
							<p className="text-lg font-semibold text-foreground">
								{medicalReportData.surgeon}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Anesthesiologist
							</p>
							<p className="text-lg font-semibold text-foreground">
								{medicalReportData.anesthesiologist}
							</p>
						</div>
					</div>

					{/* Operative Notes */}
					<div>
						<h3 className="text-xl font-semibold text-foreground mb-3">
							Operative Notes
						</h3>
						<p className="text-foreground bg-muted p-4 rounded-lg">
							{medicalReportData.operativeNotes}
						</p>
					</div>

					{/* Post-Op Instructions */}
					<div>
						<h3 className="text-xl font-semibold text-foreground mb-3">
							Post-Operative Instructions
						</h3>
						<ul className="space-y-2">
							{medicalReportData.postOpInstructions.map(
								(instruction, idx) => (
									<li
										key={idx}
										className="flex items-start gap-3 text-foreground"
									>
										<span className="text-primary font-bold">
											•
										</span>
										<span>{instruction}</span>
									</li>
								)
							)}
						</ul>
					</div>

					{/* Medications */}
					<div>
						<h3 className="text-xl font-semibold text-foreground mb-3">
							Current Medications
						</h3>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-border">
										<th className="text-left py-2 px-3 font-semibold text-foreground">
											Medication
										</th>
										<th className="text-left py-2 px-3 font-semibold text-foreground">
											Dosage
										</th>
										<th className="text-left py-2 px-3 font-semibold text-foreground">
											Frequency
										</th>
										<th className="text-left py-2 px-3 font-semibold text-foreground">
											Duration
										</th>
									</tr>
								</thead>
								<tbody>
									{medicalReportData.medications.map(
										(med, idx) => (
											<tr
												key={idx}
												className="border-b border-border hover:bg-muted"
											>
												<td className="py-3 px-3 text-foreground">
													{med.name}
												</td>
												<td className="py-3 px-3 text-foreground">
													{med.dosage}
												</td>
												<td className="py-3 px-3 text-foreground">
													{med.frequency}
												</td>
												<td className="py-3 px-3 text-foreground">
													{med.duration}
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					</div>

					{/* Follow-up Schedule */}
					<div>
						<h3 className="text-xl font-semibold text-foreground mb-3">
							Follow-up Schedule
						</h3>
						<div className="space-y-3">
							{medicalReportData.followUpSchedule.map(
								(followUp, idx) => (
									<div
										key={idx}
										className="p-4 bg-muted rounded-lg"
									>
										<div className="flex justify-between items-start">
											<div>
												<p className="font-semibold text-foreground">
													{followUp.type}
												</p>
												<p className="text-sm text-muted-foreground">
													{followUp.location}
												</p>
											</div>
											<p className="text-sm font-medium text-primary">
												{followUp.date}
											</p>
										</div>
									</div>
								)
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default PatientHealthReport;
