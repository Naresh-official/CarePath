import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DoctorManagement() {
	const [doctors, setDoctors] = useState([
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
			name: "Dr. Sarah Wilson",
			role: "Care Coordinator",
			email: "s.wilson@hospital.com",
			verified: false,
			status: "pending",
		},
	]);

	const [showNewDoctorForm, setShowNewDoctorForm] = useState(false);
	const [newDoctorForm, setNewDoctorForm] = useState({
		name: "",
		role: "",
		email: "",
	});

	const handleAddDoctor = () => {
		if (newDoctorForm.name && newDoctorForm.email) {
			setDoctors([
				...doctors,
				{
					id: doctors.length + 1,
					...newDoctorForm,
					verified: false,
					status: "pending",
				},
			]);
			setNewDoctorForm({ name: "", role: "", email: "" });
			setShowNewDoctorForm(false);
		}
	};

	const handleVerifyDoctor = (id: number) => {
		setDoctors(
			doctors.map((d) =>
				d.id === id ? { ...d, verified: true, status: "active" } : d
			)
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-semibold text-foreground">
					Doctor Management & Verification
				</h2>
				<Button
					onClick={() => setShowNewDoctorForm(!showNewDoctorForm)}
				>
					{showNewDoctorForm ? "Cancel" : "Add New Doctor"}
				</Button>
			</div>

			{showNewDoctorForm && (
				<Card className="p-6 space-y-4">
					<h3 className="font-semibold text-foreground">
						Add New Doctor
					</h3>
					<div className="space-y-3">
						<div>
							<label className="text-sm font-medium text-foreground">
								Full Name
							</label>
							<input
								type="text"
								value={newDoctorForm.name}
								onChange={(e) =>
									setNewDoctorForm({
										...newDoctorForm,
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
								value={newDoctorForm.role}
								onChange={(e) =>
									setNewDoctorForm({
										...newDoctorForm,
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
								value={newDoctorForm.email}
								onChange={(e) =>
									setNewDoctorForm({
										...newDoctorForm,
										email: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground mt-1"
								placeholder="doctor@hospital.com"
							/>
						</div>
						<Button onClick={handleAddDoctor} className="w-full">
							Add Doctor
						</Button>
					</div>
				</Card>
			)}

			<div className="space-y-3">
				{doctors.map((doctor) => (
					<Card key={doctor.id} className="p-4">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<h3 className="font-semibold text-foreground">
										{doctor.name}
									</h3>
									<span
										className={`px-2 py-1 rounded text-xs font-medium ${
											doctor.verified
												? "bg-green-100 text-green-800"
												: "bg-yellow-100 text-yellow-800"
										}`}
									>
										{doctor.verified
											? "Verified"
											: "Pending Verification"}
									</span>
									<span
										className={`px-2 py-1 rounded text-xs font-medium ${
											doctor.status === "active"
												? "bg-blue-100 text-blue-800"
												: "bg-gray-100 text-gray-800"
										}`}
									>
										{doctor.status === "active"
											? "Active"
											: "Inactive"}
									</span>
								</div>
								<p className="text-sm text-muted-foreground">
									{doctor.role}
								</p>
								<p className="text-sm text-muted-foreground">
									{doctor.email}
								</p>
							</div>
							<div className="flex gap-2">
								{!doctor.verified && (
									<Button
										size="sm"
										onClick={() =>
											handleVerifyDoctor(doctor.id)
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
	);
}
