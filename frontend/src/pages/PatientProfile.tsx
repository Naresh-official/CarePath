"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function PatientProfile() {
	const [activeTab, setActiveTab] = useState<
		"overview" | "symptoms" | "medications" | "notes"
	>("overview");

	const patientData = {
		name: "Sarah Johnson",
		age: 34,
		procedure: "ACL Repair",
		daysPostOp: 5,
		adherence: 92,
		riskLevel: "stable",
		contact: "(555) 123-4567",
		email: "sarah.johnson@email.com",
		surgeon: "Dr. Michael Johnson",
		medications: [
			{
				name: "Ibuprofen 400mg",
				schedule: "Every 6 hours",
				adherence: 95,
			},
			{
				name: "Amoxicillin 500mg",
				schedule: "Twice daily",
				adherence: 90,
			},
			{ name: "Vitamin C 1000mg", schedule: "Once daily", adherence: 85 },
		],
		symptoms: [
			{ date: "Today 2:30 PM", pain: 4, temperature: 98.6, mood: "good" },
			{ date: "Today 8:00 AM", pain: 5, temperature: 98.8, mood: "good" },
			{
				date: "Yesterday 2:00 PM",
				pain: 6,
				temperature: 99.1,
				mood: "okay",
			},
		],
		notes: [
			{
				date: "Today 10:00 AM",
				author: "Dr. Johnson",
				text: "Patient progressing well. Continue current PT protocol.",
			},
			{
				date: "Yesterday 3:00 PM",
				author: "Nurse Sarah",
				text: "Wound check completed. Healing normally, no signs of infection.",
			},
		],
	};

	return (
		<div className="p-4 md:p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						{patientData.name}
					</h1>
					<p className="text-muted-foreground">
						{patientData.procedure}
					</p>
				</div>
				<span
					className={`px-4 py-2 rounded-full font-medium w-fit ${
						patientData.riskLevel === "stable"
							? "bg-green-100 text-green-800"
							: patientData.riskLevel === "monitor"
							? "bg-yellow-100 text-yellow-800"
							: "bg-red-100 text-red-800"
					}`}
				>
					{patientData.riskLevel.charAt(0).toUpperCase() +
						patientData.riskLevel.slice(1)}
				</span>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card className="p-4">
					<p className="text-sm text-muted-foreground">Age</p>
					<p className="text-2xl font-bold text-foreground">
						{patientData.age}
					</p>
				</Card>
				<Card className="p-4">
					<p className="text-sm text-muted-foreground">
						Days Post-Op
					</p>
					<p className="text-2xl font-bold text-foreground">
						Day {patientData.daysPostOp}
					</p>
				</Card>
				<Card className="p-4">
					<p className="text-sm text-muted-foreground">Adherence</p>
					<p className="text-2xl font-bold text-foreground">
						{patientData.adherence}%
					</p>
				</Card>
				<Card className="p-4">
					<p className="text-sm text-muted-foreground">Surgeon</p>
					<p className="text-lg font-semibold text-foreground">
						{patientData.surgeon}
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
							{patientData.contact}
						</p>
					</div>
					<div>
						<p className="text-muted-foreground">Email</p>
						<p className="font-medium text-foreground">
							{patientData.email}
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
								Recent Symptom Logs
							</h2>
							<div className="space-y-3">
								{patientData.symptoms.map((symptom, idx) => (
									<div
										key={idx}
										className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
									>
										<div>
											<p className="font-medium text-foreground">
												Pain: {symptom.pain}/10 | Temp:{" "}
												{symptom.temperature}°F
											</p>
											<p className="text-sm text-muted-foreground">
												{symptom.date}
											</p>
										</div>
										<span className="text-green-600">
											✓
										</span>
									</div>
								))}
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
							<div className="space-y-3">
								{patientData.symptoms.map((symptom, idx) => (
									<div
										key={idx}
										className="p-4 border border-border rounded-lg"
									>
										<div className="flex justify-between items-start mb-3">
											<p className="font-medium text-foreground">
												{symptom.date}
											</p>
											<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
												Logged
											</span>
										</div>
										<div className="grid grid-cols-3 gap-4 text-sm">
											<div>
												<p className="text-muted-foreground">
													Pain Level
												</p>
												<p className="font-semibold text-foreground">
													{symptom.pain}/10
												</p>
											</div>
											<div>
												<p className="text-muted-foreground">
													Temperature
												</p>
												<p className="font-semibold text-foreground">
													{symptom.temperature}°F
												</p>
											</div>
											<div>
												<p className="text-muted-foreground">
													Mood
												</p>
												<p className="font-semibold text-foreground capitalize">
													{symptom.mood}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</Card>
					</div>
				)}

				{activeTab === "medications" && (
					<div className="space-y-4">
						<Card className="p-6 space-y-4">
							<h2 className="font-semibold text-lg text-foreground">
								Current Medications
							</h2>
							<div className="space-y-3">
								{patientData.medications.map((med, idx) => (
									<div
										key={idx}
										className="p-4 border border-border rounded-lg"
									>
										<div className="flex justify-between items-start mb-2">
											<div>
												<p className="font-semibold text-foreground">
													{med.name}
												</p>
												<p className="text-sm text-muted-foreground">
													{med.schedule}
												</p>
											</div>
											<span className="text-sm font-medium text-primary">
												{med.adherence}% adherence
											</span>
										</div>
										<div className="w-full bg-muted rounded-full h-2 overflow-hidden">
											<div
												className="bg-primary h-full transition-all"
												style={{
													width: `${med.adherence}%`,
												}}
											/>
										</div>
									</div>
								))}
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
							<div className="space-y-3">
								{patientData.notes.map((note, idx) => (
									<div
										key={idx}
										className="p-4 border border-border rounded-lg bg-muted/30"
									>
										<div className="flex justify-between items-start mb-2">
											<div>
												<p className="font-semibold text-foreground">
													{note.author}
												</p>
												<p className="text-xs text-muted-foreground">
													{note.date}
												</p>
											</div>
										</div>
										<p className="text-sm text-foreground">
											{note.text}
										</p>
									</div>
								))}
							</div>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
}

export default PatientProfile;
