"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

function DoctorDashboard() {
	const navigate = useNavigate();
	const [filterRisk, setFilterRisk] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<"name" | "risk" | "day">("risk");

	const allPatients = [
		{
			id: 1,
			name: "Sarah Johnson",
			procedure: "ACL Repair",
			day: 5,
			risk: "stable",
			alerts: 0,
			adherence: 92,
			lastCheckin: "2 hours ago",
		},
		{
			id: 2,
			name: "Michael Chen",
			procedure: "Hip Replacement",
			day: 2,
			risk: "monitor",
			alerts: 1,
			adherence: 78,
			lastCheckin: "4 hours ago",
		},
		{
			id: 3,
			name: "Emma Davis",
			procedure: "Knee Surgery",
			day: 7,
			risk: "critical",
			alerts: 3,
			adherence: 65,
			lastCheckin: "30 min ago",
		},
		{
			id: 4,
			name: "James Wilson",
			procedure: "Shoulder Surgery",
			day: 3,
			risk: "stable",
			alerts: 0,
			adherence: 88,
			lastCheckin: "1 hour ago",
		},
		{
			id: 5,
			name: "Lisa Anderson",
			procedure: "Spine Surgery",
			day: 1,
			risk: "monitor",
			alerts: 2,
			lastCheckin: "Just now",
		},
	];

	let filteredPatients = allPatients;
	if (filterRisk) {
		filteredPatients = filteredPatients.filter(
			(p) => p.risk === filterRisk
		);
	}
	if (searchTerm) {
		filteredPatients = filteredPatients.filter(
			(p) =>
				p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.procedure.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	filteredPatients.sort((a, b) => {
		if (sortBy === "name") return a.name.localeCompare(b.name);
		if (sortBy === "day") return b.day - a.day;
		const riskOrder = { critical: 0, monitor: 1, stable: 2 };
		return (
			riskOrder[a.risk as keyof typeof riskOrder] -
			riskOrder[b.risk as keyof typeof riskOrder]
		);
	});

	const stats = {
		total: allPatients.length,
		critical: allPatients.filter((p) => p.risk === "critical").length,
		monitor: allPatients.filter((p) => p.risk === "monitor").length,
		stable: allPatients.filter((p) => p.risk === "stable").length,
	};

	return (
		<div className="p-4 md:p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-foreground">
					Patient Triage
				</h1>
				<p className="text-muted-foreground">
					Monitor all assigned patients
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card className="p-4">
					<p className="text-sm text-muted-foreground">
						Total Patients
					</p>
					<p className="text-3xl font-bold text-foreground">
						{stats.total}
					</p>
				</Card>
				<Card className="p-4 border-l-4 border-l-red-500">
					<p className="text-sm text-muted-foreground">Critical</p>
					<p className="text-3xl font-bold text-red-600">
						{stats.critical}
					</p>
				</Card>
				<Card className="p-4 border-l-4 border-l-yellow-500">
					<p className="text-sm text-muted-foreground">Monitor</p>
					<p className="text-3xl font-bold text-yellow-600">
						{stats.monitor}
					</p>
				</Card>
				<Card className="p-4 border-l-4 border-l-green-500">
					<p className="text-sm text-muted-foreground">Stable</p>
					<p className="text-3xl font-bold text-green-600">
						{stats.stable}
					</p>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card className="p-4 space-y-4">
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1">
						<Input
							type="text"
							placeholder="Search by name or procedure..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className="flex gap-2 flex-wrap">
						<Button
							variant={
								filterRisk === null ? "default" : "outline"
							}
							size="sm"
							onClick={() => setFilterRisk(null)}
						>
							All
						</Button>
						<Button
							variant={
								filterRisk === "critical"
									? "destructive"
									: "outline"
							}
							size="sm"
							onClick={() => setFilterRisk("critical")}
							className={
								filterRisk === "critical"
									? ""
									: "hover:bg-red-50"
							}
						>
							Critical
						</Button>
						<Button
							variant={
								filterRisk === "monitor" ? "default" : "outline"
							}
							size="sm"
							onClick={() => setFilterRisk("monitor")}
							className={
								filterRisk === "monitor"
									? "bg-yellow-500 hover:bg-yellow-600 text-white"
									: "hover:bg-yellow-50"
							}
						>
							Monitor
						</Button>
						<Button
							variant={
								filterRisk === "stable" ? "default" : "outline"
							}
							size="sm"
							onClick={() => setFilterRisk("stable")}
							className={
								filterRisk === "stable"
									? "bg-green-500 hover:bg-green-600 text-white"
									: "hover:bg-green-50"
							}
						>
							Stable
						</Button>
					</div>
				</div>

				<div className="flex gap-2 items-center">
					<Label htmlFor="sort-by" className="text-sm">
						Sort by:
					</Label>
					<Select
						value={sortBy}
						onValueChange={(value) =>
							setSortBy(value as "name" | "risk" | "day")
						}
					>
						<SelectTrigger id="sort-by" className="w-[180px]">
							<SelectValue placeholder="Select sort option" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="risk">Risk Level</SelectItem>
							<SelectItem value="name">Patient Name</SelectItem>
							<SelectItem value="day">Days Post-Op</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</Card>

			{/* Patient List */}
			<div className="space-y-3">
				{filteredPatients.length > 0 ? (
					filteredPatients.map((patient) => (
						<Card
							key={patient.id}
							className={`p-4 cursor-pointer transition-all hover:shadow-md border-l-4 ${
								patient.risk === "critical"
									? "border-l-red-500 hover:border-l-red-600"
									: patient.risk === "monitor"
									? "border-l-yellow-500 hover:border-l-yellow-600"
									: "border-l-green-500 hover:border-l-green-600"
							}`}
							onClick={() => {
								navigate(`/patient/${patient.id}`);
							}}
						>
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<h3 className="font-semibold text-foreground text-lg">
											{patient.name}
										</h3>
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium ${
												patient.risk === "stable"
													? "bg-green-100 text-green-800"
													: patient.risk === "monitor"
													? "bg-yellow-100 text-yellow-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{patient.risk
												.charAt(0)
												.toUpperCase() +
												patient.risk.slice(1)}
										</span>
										{patient.alerts > 0 && (
											<span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
												{patient.alerts} alert
												{patient.alerts > 1 ? "s" : ""}
											</span>
										)}
									</div>
									<p className="text-sm text-muted-foreground mb-2">
										{patient.procedure}
									</p>
									<div className="grid grid-cols-3 gap-4 text-sm">
										<div>
											<p className="text-muted-foreground">
												Day Post-Op
											</p>
											<p className="font-semibold text-foreground">
												Day {patient.day}
											</p>
										</div>
										<div>
											<p className="text-muted-foreground">
												Adherence
											</p>
											<p className="font-semibold text-foreground">
												{patient.adherence}%
											</p>
										</div>
										<div>
											<p className="text-muted-foreground">
												Last Check-in
											</p>
											<p className="font-semibold text-foreground">
												{patient.lastCheckin}
											</p>
										</div>
									</div>
								</div>
								<Button
									size="sm"
									className="w-full md:w-auto"
									onClick={(e) => {
										e.stopPropagation();
										navigate(`/patient/${patient.id}`);
									}}
								>
									View Profile
								</Button>
							</div>
						</Card>
					))
				) : (
					<div className="text-center py-8">
						<p className="text-muted-foreground">
							No patients found matching your criteria
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default DoctorDashboard;
