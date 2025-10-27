"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Metric Card Component
function MetricCard({
	label,
	value,
	borderColor,
}: {
	label: string;
	value: number;
	borderColor: string;
}) {
	return (
		<Card className={`p-4 border-l-4 ${borderColor}`}>
			<p className="text-sm text-muted-foreground">{label}</p>
			<p className="text-2xl font-bold text-foreground mt-2">{value}</p>
		</Card>
	);
}

// Risk Distribution Item Component
function RiskDistributionItem({
	status,
	count,
	percentage,
}: {
	status: string;
	count: number;
	percentage: number;
}) {
	const barColor =
		status === "Stable"
			? "bg-green-500"
			: status === "Monitor"
			? "bg-yellow-500"
			: "bg-red-500";

	return (
		<div className="space-y-2">
			<div className="flex justify-between items-center">
				<p className="text-sm font-medium text-foreground">{status}</p>
				<span className="text-sm font-semibold text-foreground">
					{count} patients ({percentage}%)
				</span>
			</div>
			<div className="w-full bg-muted rounded-full h-3 overflow-hidden">
				<div
					className={`h-full transition-all ${barColor}`}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}

function Analytics() {
	const [timePeriod, setTimePeriod] = useState<"week" | "month" | "quarter">(
		"month"
	);

	const analyticsData = {
		month: {
			readmissionRate: 8.2,
			readmissionTrend: -12,
			erVisitReduction: 34,
			erVisitTrend: 5,
			avgLengthOfStay: 3.2,
			lossTrend: -0.5,
			adherence: 89,
			adherenceTrend: 3,
			totalPatients: 47,
			recoveredPatients: 42,
			activeAlerts: 3,
			completedCheckIns: 156,
		},
		week: {
			readmissionRate: 7.8,
			readmissionTrend: -5,
			erVisitReduction: 31,
			erVisitTrend: 2,
			avgLengthOfStay: 3.1,
			lossTrend: -0.2,
			adherence: 87,
			adherenceTrend: 1,
			totalPatients: 47,
			recoveredPatients: 40,
			activeAlerts: 3,
			completedCheckIns: 42,
		},
		quarter: {
			readmissionRate: 8.5,
			readmissionTrend: -18,
			erVisitReduction: 36,
			erVisitTrend: 8,
			avgLengthOfStay: 3.4,
			lossTrend: -0.8,
			adherence: 91,
			adherenceTrend: 5,
			totalPatients: 47,
			recoveredPatients: 44,
			activeAlerts: 3,
			completedCheckIns: 468,
		},
	};

	const data = analyticsData[timePeriod];

	const procedureMetrics = [
		{
			name: "ACL Repair",
			patients: 12,
			avgRecoveryDays: 28,
			adherence: 92,
			satisfaction: 95,
		},
		{
			name: "Hip Replacement",
			patients: 15,
			avgRecoveryDays: 42,
			adherence: 87,
			satisfaction: 91,
		},
		{
			name: "Knee Surgery",
			patients: 10,
			avgRecoveryDays: 35,
			adherence: 85,
			satisfaction: 88,
		},
		{
			name: "Shoulder Surgery",
			patients: 10,
			avgRecoveryDays: 30,
			adherence: 90,
			satisfaction: 93,
		},
	];

	const riskDistribution = [
		{ status: "Stable", count: 38, percentage: 81 },
		{ status: "Monitor", count: 6, percentage: 13 },
		{ status: "Critical", count: 3, percentage: 6 },
	];

	const timePeriods = ["week", "month", "quarter"] as const;

	return (
		<div className="p-4 md:p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Analytics & Reporting
					</h1>
					<p className="text-muted-foreground">
						Key performance indicators and insights
					</p>
				</div>
				<div className="flex gap-2">
					{timePeriods.map((period) => (
						<Button
							key={period}
							variant={
								timePeriod === period ? "default" : "outline"
							}
							size="sm"
							onClick={() => setTimePeriod(period)}
						>
							{period.charAt(0).toUpperCase() + period.slice(1)}
						</Button>
					))}
				</div>
			</div>

			{/* Secondary Metrics */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<MetricCard
					label="Total Patients"
					value={data.totalPatients}
					borderColor="border-l-blue-500"
				/>
				<MetricCard
					label="Recovered"
					value={data.recoveredPatients}
					borderColor="border-l-green-500"
				/>
				<MetricCard
					label="Active Alerts"
					value={data.activeAlerts}
					borderColor="border-l-red-500"
				/>
				<MetricCard
					label="Check-ins Completed"
					value={data.completedCheckIns}
					borderColor="border-l-purple-500"
				/>
			</div>

			{/* Risk Distribution */}
			<Card className="p-6 space-y-4">
				<h2 className="font-semibold text-lg text-foreground">
					Patient Risk Distribution
				</h2>
				<div className="space-y-3">
					{riskDistribution.map((item, idx) => (
						<RiskDistributionItem key={idx} {...item} />
					))}
				</div>
			</Card>

			{/* Procedure Metrics */}
			<Card className="p-6 space-y-4">
				<h2 className="font-semibold text-lg text-foreground">
					Performance by Procedure Type
				</h2>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-border">
								<th className="text-left py-3 px-4 font-semibold text-foreground">
									Procedure
								</th>
								<th className="text-left py-3 px-4 font-semibold text-foreground">
									Patients
								</th>
								<th className="text-left py-3 px-4 font-semibold text-foreground">
									Avg Recovery
								</th>
								<th className="text-left py-3 px-4 font-semibold text-foreground">
									Adherence
								</th>
								<th className="text-left py-3 px-4 font-semibold text-foreground">
									Satisfaction
								</th>
							</tr>
						</thead>
						<tbody>
							{procedureMetrics.map((proc, idx) => (
								<tr
									key={idx}
									className="border-b border-border hover:bg-muted/50 transition-colors"
								>
									<td className="py-3 px-4 font-medium text-foreground">
										{proc.name}
									</td>
									<td className="py-3 px-4 text-muted-foreground">
										{proc.patients}
									</td>
									<td className="py-3 px-4 text-muted-foreground">
										{proc.avgRecoveryDays} days
									</td>
									<td className="py-3 px-4">
										<div className="flex items-center gap-2">
											<div className="w-16 bg-muted rounded-full h-2 overflow-hidden">
												<div
													className="bg-primary h-full"
													style={{
														width: `${proc.adherence}%`,
													}}
												/>
											</div>
											<span className="text-sm font-medium text-foreground">
												{proc.adherence}%
											</span>
										</div>
									</td>
									<td className="py-3 px-4">
										<span className="text-sm font-medium text-foreground">
											{proc.satisfaction}%
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
}

export default Analytics;
