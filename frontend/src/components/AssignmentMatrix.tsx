import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AssignmentMatrix() {
	const [assignments] = useState([
		{
			id: 1,
			patient: "Sarah Johnson",
			doctor: "Dr. Michael Johnson",
			role: "Primary Surgeon",
			assignedDate: "2024-01-15",
		},
		{
			id: 2,
			patient: "Sarah Johnson",
			doctor: "Dr. Sarah Wilson",
			role: "Care Coordinator",
			assignedDate: "2024-01-15",
		},
		{
			id: 3,
			patient: "Michael Chen",
			doctor: "Dr. Sarah Chen",
			role: "Primary Cardiologist",
			assignedDate: "2024-01-20",
		},
	]);

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold text-foreground">
				Assignment Matrix
			</h2>
			<p className="text-sm text-muted-foreground">
				Manage patient-to-doctor assignments for care routing
			</p>

			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-border">
							<th className="text-left py-3 px-4 font-semibold text-foreground">
								Patient
							</th>
							<th className="text-left py-3 px-4 font-semibold text-foreground">
								Assigned Doctor
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
									{assignment.doctor}
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
					Use bulk selection to assign multiple patients to doctors.
					This routing is critical for the Alert Engine and Messages
					features.
				</p>
			</Card>
		</div>
	);
}
