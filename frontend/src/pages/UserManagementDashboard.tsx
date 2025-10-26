"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UserManagementDashboard() {
	const [activeTab, setActiveTab] = useState<
		"clinicians" | "patients" | "assignments"
	>("clinicians");
	const [clinicians, setClinicians] = useState([
		{
			id: 1,
			name: "Dr. Michael Johnson",
			role: "Surgeon",
			email: "m.johnson@hospital.com",
			verified: true,
			status: "active",
		},
		{
			id: 2,
			name: "Dr. Sarah Chen",
			role: "Cardiologist",
			email: "s.chen@hospital.com",
			verified: true,
			status: "active",
		},
		{
			id: 3,
			name: "Nurse Sarah",
			role: "Care Coordinator",
			email: "nurse.sarah@hospital.com",
			verified: false,
			status: "pending",
		},
	]);
	const [patients, setPatients] = useState([
		{
			id: 1,
			name: "Sarah Johnson",
			dob: "1990-05-15",
			carePathway: "Orthopedic Surgery",
			status: "active",
		},
		{
			id: 2,
			name: "Michael Chen",
			dob: "1985-08-22",
			carePathway: "Cardiac Surgery",
			status: "active",
		},
		{
			id: 3,
			name: "Emma Davis",
			dob: "1992-03-10",
			carePathway: "Orthopedic Surgery",
			status: "active",
		},
	]);
	const [assignments, setAssignments] = useState([
		{
			id: 1,
			patient: "Sarah Johnson",
			clinician: "Dr. Michael Johnson",
			role: "Primary Surgeon",
			assignedDate: "2024-01-15",
		},
		{
			id: 2,
			patient: "Sarah Johnson",
			clinician: "Nurse Sarah",
			role: "Care Coordinator",
			assignedDate: "2024-01-15",
		},
		{
			id: 3,
			patient: "Michael Chen",
			clinician: "Dr. Sarah Chen",
			role: "Primary Cardiologist",
			assignedDate: "2024-01-20",
		},
	]);
	const [showNewClinicianForm, setShowNewClinicianForm] = useState(false);
	const [showNewPatientForm, setShowNewPatientForm] = useState(false);
	const [newClinicianForm, setNewClinicianForm] = useState({
		name: "",
		role: "",
		email: "",
	});
	const [newPatientForm, setNewPatientForm] = useState({
		name: "",
		dob: "",
		carePathway: "",
	});

	const handleAddClinician = () => {
		if (newClinicianForm.name && newClinicianForm.email) {
			setClinicians([
				...clinicians,
				{
					id: clinicians.length + 1,
					...newClinicianForm,
					verified: false,
					status: "pending",
				},
			]);
			setNewClinicianForm({ name: "", role: "", email: "" });
			setShowNewClinicianForm(false);
		}
	};

	const handleAddPatient = () => {
		if (newPatientForm.name && newPatientForm.carePathway) {
			setPatients([
				...patients,
				{
					id: patients.length + 1,
					...newPatientForm,
					status: "active",
				},
			]);
			setNewPatientForm({ name: "", dob: "", carePathway: "" });
			setShowNewPatientForm(false);
		}
	};

	const handleVerifyClinician = (id: number) => {
		setClinicians(
			clinicians.map((c) =>
				c.id === id ? { ...c, verified: true, status: "active" } : c
			)
		);
	};

	return (
		<div className="p-4 md:p-6 space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-foreground">
					User Management
				</h1>
				<p className="text-muted-foreground">
					Manage clinicians, patients, and care team assignments
				</p>
			</div>

			<div className="flex gap-2 border-b border-border overflow-x-auto">
				{(["clinicians", "patients", "assignments"] as const).map(
					(tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
								activeTab === tab
									? "text-primary border-b-2 border-primary"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{tab === "clinicians" && "Clinician Management"}
							{tab === "patients" && "Patient Enrollment"}
							{tab === "assignments" && "Assignment Matrix"}
						</button>
					)
				)}
			</div>

			{activeTab === "clinicians" && (
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold text-foreground">
							Clinician Management & Verification
						</h2>
						<Button
							onClick={() =>
								setShowNewClinicianForm(!showNewClinicianForm)
							}
						>
							{showNewClinicianForm
								? "Cancel"
								: "Add New Clinician"}
						</Button>
					</div>

					{showNewClinicianForm && (
						<Card className="p-6 space-y-4">
							<h3 className="font-semibold text-foreground">
								Add New Clinician
							</h3>
							<div className="space-y-3">
								<div>
									<label className="text-sm font-medium text-foreground">
										Full Name
									</label>
									<input
										type="text"
										value={newClinicianForm.name}
										onChange={(e) =>
											setNewClinicianForm({
												...newClinicianForm,
												name: e.target.value,
											})
										}
										className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground mt-1"
										placeholder="Dr. John Doe"
									/>
								</div>
								<div>
									<label className="text-sm font-medium text-foreground">
										Role
									</label>
									<select
										value={newClinicianForm.role}
										onChange={(e) =>
											setNewClinicianForm({
												...newClinicianForm,
												role: e.target.value,
											})
										}
										className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground mt-1"
									>
										<option value="">Select Role</option>
										<option value="Surgeon">Surgeon</option>
										<option value="Cardiologist">
											Cardiologist
										</option>
										<option value="Nurse">Nurse</option>
										<option value="Care Coordinator">
											Care Coordinator
										</option>
										<option value="Physical Therapist">
											Physical Therapist
										</option>
									</select>
								</div>
								<div>
									<label className="text-sm font-medium text-foreground">
										Email
									</label>
									<input
										type="email"
										value={newClinicianForm.email}
										onChange={(e) =>
											setNewClinicianForm({
												...newClinicianForm,
												email: e.target.value,
											})
										}
										className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground mt-1"
										placeholder="doctor@hospital.com"
									/>
								</div>
								<Button
									onClick={handleAddClinician}
									className="w-full"
								>
									Add Clinician
								</Button>
							</div>
						</Card>
					)}

					<div className="space-y-3">
						{clinicians.map((clinician) => (
							<Card key={clinician.id} className="p-4">
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<h3 className="font-semibold text-foreground">
												{clinician.name}
											</h3>
											<span
												className={`px-2 py-1 rounded text-xs font-medium ${
													clinician.verified
														? "bg-green-100 text-green-800"
														: "bg-yellow-100 text-yellow-800"
												}`}
											>
												{clinician.verified
													? "Verified"
													: "Pending Verification"}
											</span>
											<span
												className={`px-2 py-1 rounded text-xs font-medium ${
													clinician.status ===
													"active"
														? "bg-blue-100 text-blue-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{clinician.status === "active"
													? "Active"
													: "Inactive"}
											</span>
										</div>
										<p className="text-sm text-muted-foreground">
											{clinician.role}
										</p>
										<p className="text-sm text-muted-foreground">
											{clinician.email}
										</p>
									</div>
									<div className="flex gap-2">
										{!clinician.verified && (
											<Button
												size="sm"
												onClick={() =>
													handleVerifyClinician(
														clinician.id
													)
												}
											>
												Verify Credentials
											</Button>
										)}
										<Button size="sm" variant="outline">
											Edit Access
										</Button>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			)}

			{activeTab === "patients" && (
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold text-foreground">
							Patient Enrollment & Activation
						</h2>
						<Button
							onClick={() =>
								setShowNewPatientForm(!showNewPatientForm)
							}
						>
							{showNewPatientForm
								? "Cancel"
								: "Enroll New Patient"}
						</Button>
					</div>

					{showNewPatientForm && (
						<Card className="p-6 space-y-4">
							<h3 className="font-semibold text-foreground">
								Enroll New Patient
							</h3>
							<div className="space-y-3">
								<div>
									<label className="text-sm font-medium text-foreground">
										Patient Name
									</label>
									<input
										type="text"
										value={newPatientForm.name}
										onChange={(e) =>
											setNewPatientForm({
												...newPatientForm,
												name: e.target.value,
											})
										}
										className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground mt-1"
										placeholder="John Doe"
									/>
								</div>
								<div>
									<label className="text-sm font-medium text-foreground">
										Date of Birth
									</label>
									<input
										type="date"
										value={newPatientForm.dob}
										onChange={(e) =>
											setNewPatientForm({
												...newPatientForm,
												dob: e.target.value,
											})
										}
										className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground mt-1"
									/>
								</div>
								<div>
									<label className="text-sm font-medium text-foreground">
										Care Pathway
									</label>
									<select
										value={newPatientForm.carePathway}
										onChange={(e) =>
											setNewPatientForm({
												...newPatientForm,
												carePathway: e.target.value,
											})
										}
										className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground mt-1"
									>
										<option value="">
											Select Care Pathway
										</option>
										<option value="Orthopedic Surgery">
											Orthopedic Surgery
										</option>
										<option value="Cardiac Surgery">
											Cardiac Surgery
										</option>
										<option value="General Surgery">
											General Surgery
										</option>
										<option value="Oncology">
											Oncology
										</option>
									</select>
								</div>
								<Button
									onClick={handleAddPatient}
									className="w-full"
								>
									Enroll Patient
								</Button>
							</div>
						</Card>
					)}

					<div className="space-y-3">
						{patients.map((patient) => (
							<Card key={patient.id} className="p-4">
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<div className="flex-1">
										<h3 className="font-semibold text-foreground mb-1">
											{patient.name}
										</h3>
										<p className="text-sm text-muted-foreground">
											DOB: {patient.dob}
										</p>
										<p className="text-sm text-muted-foreground">
											Care Pathway: {patient.carePathway}
										</p>
										<span className="inline-block mt-2 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
											{patient.status === "active"
												? "Active"
												: "Inactive"}
										</span>
									</div>
									<Button size="sm" variant="outline">
										Edit Details
									</Button>
								</div>
							</Card>
						))}
					</div>
				</div>
			)}

			{activeTab === "assignments" && (
				<div className="space-y-4">
					<h2 className="text-xl font-semibold text-foreground">
						Assignment Matrix
					</h2>
					<p className="text-sm text-muted-foreground">
						Manage patient-to-clinician assignments for care routing
					</p>

					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-border">
									<th className="text-left py-3 px-4 font-semibold text-foreground">
										Patient
									</th>
									<th className="text-left py-3 px-4 font-semibold text-foreground">
										Assigned Clinician
									</th>
									<th className="text-left py-3 px-4 font-semibold text-foreground">
										Role
									</th>
									<th className="text-left py-3 px-4 font-semibold text-foreground">
										Assigned Date
									</th>
									<th className="text-left py-3 px-4 font-semibold text-foreground">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{assignments.map((assignment) => (
									<tr
										key={assignment.id}
										className="border-b border-border hover:bg-muted/50 transition-colors"
									>
										<td className="py-3 px-4 font-medium text-foreground">
											{assignment.patient}
										</td>
										<td className="py-3 px-4 text-muted-foreground">
											{assignment.clinician}
										</td>
										<td className="py-3 px-4 text-muted-foreground">
											{assignment.role}
										</td>
										<td className="py-3 px-4 text-muted-foreground">
											{assignment.assignedDate}
										</td>
										<td className="py-3 px-4">
											<Button size="sm" variant="outline">
												Edit
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<Card className="p-4 bg-blue-50 border-blue-200">
						<p className="text-sm text-blue-800">
							Use bulk selection to assign multiple patients to
							clinicians. This routing is critical for the Alert
							Engine and Messages features.
						</p>
					</Card>
				</div>
			)}
		</div>
	);
}
