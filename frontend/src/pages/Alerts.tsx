"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function Alerts() {
	const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
	const [filterStatus, setFilterStatus] = useState<"active" | "resolved">(
		"active"
	);

	const allAlerts = [
		{
			id: 1,
			patient: "Emma Davis",
			severity: "critical",
			type: "High Fever",
			message: "Temperature 101.2°F detected",
			time: "1 hour ago",
			status: "active",
			actions: ["Contact Patient", "Schedule Call", "Escalate"],
		},
		{
			id: 2,
			patient: "Michael Chen",
			severity: "warning",
			type: "Missed Medication",
			message: "Patient missed evening medication reminder",
			time: "3 hours ago",
			status: "active",
			actions: ["Send Reminder", "Contact Patient"],
		},
		{
			id: 3,
			patient: "Lisa Anderson",
			severity: "warning",
			type: "Low Adherence",
			message: "Medication adherence dropped to 65%",
			time: "5 hours ago",
			status: "active",
			actions: ["Review Plan", "Contact Patient"],
		},
		{
			id: 4,
			patient: "James Wilson",
			severity: "info",
			type: "Check-in Completed",
			message: "Patient completed daily symptom check-in",
			time: "2 hours ago",
			status: "resolved",
			actions: ["View Details"],
		},
	];

	let filteredAlerts = allAlerts.filter((a) => a.status === filterStatus);
	if (filterSeverity) {
		filteredAlerts = filteredAlerts.filter(
			(a) => a.severity === filterSeverity
		);
	}

	const stats = {
		critical: allAlerts.filter(
			(a) => a.severity === "critical" && a.status === "active"
		).length,
		warning: allAlerts.filter(
			(a) => a.severity === "warning" && a.status === "active"
		).length,
		info: allAlerts.filter(
			(a) => a.severity === "info" && a.status === "active"
		).length,
	};

	const statusFilters = [
		{ value: "active" as const, label: "Active" },
		{ value: "resolved" as const, label: "Resolved" },
	];

	const severityFilters = [
		{ value: null, label: "All Severity", variant: "default" as const },
		{
			value: "critical",
			label: "Critical",
			variant: "destructive" as const,
		},
		{
			value: "warning",
			label: "Warning",
			variant: "default" as const,
			color: "yellow",
		},
		{
			value: "info",
			label: "Info",
			variant: "default" as const,
			color: "blue",
		},
	];

	return (
		<div className="p-4 md:p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-foreground">
					Alerts & Interventions
				</h1>
				<p className="text-muted-foreground">
					Monitor and manage patient alerts
				</p>
			</div>

			{/* Alert Stats */}
			<div className="grid grid-cols-3 gap-4">
				<Card className="p-4 border-l-4 border-l-red-500">
					<p className="text-sm text-muted-foreground">Critical</p>
					<p className="text-3xl font-bold text-red-600">
						{stats.critical}
					</p>
				</Card>
				<Card className="p-4 border-l-4 border-l-yellow-500">
					<p className="text-sm text-muted-foreground">Warning</p>
					<p className="text-3xl font-bold text-yellow-600">
						{stats.warning}
					</p>
				</Card>
				<Card className="p-4 border-l-4 border-l-blue-500">
					<p className="text-sm text-muted-foreground">Info</p>
					<p className="text-3xl font-bold text-blue-600">
						{stats.info}
					</p>
				</Card>
			</div>

			{/* Filters */}
			<Card className="p-4 space-y-4">
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex gap-2 flex-wrap">
						{statusFilters.map((filter) => (
							<Button
								key={filter.value}
								variant={
									filterStatus === filter.value
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() => setFilterStatus(filter.value)}
							>
								{filter.label}
							</Button>
						))}
					</div>
					<div className="flex gap-2 flex-wrap">
						{severityFilters.map((filter) => (
							<Button
								key={filter.label}
								variant={
									filterSeverity === filter.value
										? filter.variant
										: "outline"
								}
								size="sm"
								onClick={() => setFilterSeverity(filter.value)}
								className={
									filterSeverity === filter.value &&
									filter.color === "yellow"
										? "bg-yellow-500 hover:bg-yellow-600 text-white"
										: filterSeverity === filter.value &&
										  filter.color === "blue"
										? "bg-blue-500 hover:bg-blue-600 text-white"
										: filter.color === "yellow"
										? "hover:bg-yellow-50"
										: filter.color === "blue"
										? "hover:bg-blue-50"
										: ""
								}
							>
								{filter.label}
							</Button>
						))}
					</div>
				</div>
			</Card>

			{/* Alerts List */}
			<div className="space-y-3">
				{filteredAlerts.length > 0 ? (
					filteredAlerts.map((alert) => (
						<Card
							key={alert.id}
							className={`p-4 border-l-4 ${
								alert.severity === "critical"
									? "border-l-red-500 bg-red-50"
									: alert.severity === "warning"
									? "border-l-yellow-500 bg-yellow-50"
									: "border-l-blue-500 bg-blue-50"
							}`}
						>
							<div className="space-y-3">
								<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<p className="font-semibold text-foreground">
												{alert.patient}
											</p>
											<span
												className={`px-2 py-1 rounded text-xs font-medium ${
													alert.severity ===
													"critical"
														? "bg-red-200 text-red-800"
														: alert.severity ===
														  "warning"
														? "bg-yellow-200 text-yellow-800"
														: "bg-blue-200 text-blue-800"
												}`}
											>
												{alert.type}
											</span>
										</div>
										<p className="text-sm text-foreground mb-1">
											{alert.message}
										</p>
										<p className="text-xs text-muted-foreground">
											{alert.time}
										</p>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex flex-wrap gap-2">
									{alert.actions.map((action, idx) => (
										<Button
											key={idx}
											size="sm"
											variant="outline"
										>
											{action}
										</Button>
									))}
								</div>
							</div>
						</Card>
					))
				) : (
					<div className="text-center py-8">
						<p className="text-muted-foreground">No alerts found</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default Alerts;
