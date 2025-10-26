import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

function PatientCheckIn() {
	const [formData, setFormData] = useState({
		pain: 5,
		temperature: 98.6,
		mood: "good",
		notes: "",
	});
	const [submitted, setSubmitted] = useState(false);
	const [checkInHistory, setCheckInHistory] = useState([
		{
			date: "Today at 2:30 PM",
			pain: 4,
			temperature: 98.6,
			mood: "good",
			notes: "Feeling better after rest",
		},
		{
			date: "Yesterday at 8:00 AM",
			pain: 6,
			temperature: 99.1,
			mood: "okay",
			notes: "Some discomfort in the morning",
		},
	]);

	const handleSubmit = () => {
		setCheckInHistory([
			{
				date: new Date().toLocaleString(),
				...formData,
			},
			...checkInHistory,
		]);
		setSubmitted(true);
		setTimeout(() => setSubmitted(false), 3000);
	};

	const getSymptomAlerts = () => {
		const alerts = [];
		if (formData.temperature > 100.4) {
			alerts.push({
				type: "fever",
				message: "High fever detected. Contact your care team.",
			});
		}
		if (formData.pain > 8) {
			alerts.push({
				type: "pain",
				message:
					"Severe pain reported. Consider pain management options.",
			});
		}
		return alerts;
	};

	const alerts = getSymptomAlerts();

	return (
		<div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
			<h1 className="text-3xl font-bold text-foreground">
				Symptom Check-in
			</h1>

			{alerts.length > 0 && (
				<div className="space-y-2">
					{alerts.map((alert, idx) => (
						<div
							key={idx}
							className="p-4 bg-red-50 border border-red-200 rounded-lg"
						>
							<p className="text-sm font-medium text-red-800">
								{alert.message}
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

			<Card className="p-6 space-y-6">
				{/* Pain Scale */}
				<div className="space-y-3">
					<label className="font-semibold text-foreground">
						Pain Level: {formData.pain}/10
					</label>
					<input
						type="range"
						min="0"
						max="10"
						value={formData.pain}
						onChange={(e) =>
							setFormData({
								...formData,
								pain: Number.parseInt(e.target.value),
							})
						}
						className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
					/>
					<div className="flex justify-between text-xs text-muted-foreground">
						<span>No Pain</span>
						<span>Severe Pain</span>
					</div>
				</div>

				{/* Temperature */}
				<div className="space-y-2">
					<label className="font-semibold text-foreground">
						Temperature
					</label>
					<input
						type="number"
						step="0.1"
						value={formData.temperature}
						onChange={(e) =>
							setFormData({
								...formData,
								temperature: Number.parseFloat(e.target.value),
							})
						}
						className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
						placeholder="98.6°F"
					/>
				</div>

				{/* Mood */}
				<div className="space-y-3">
					<label className="font-semibold text-foreground">
						How are you feeling?
					</label>
					<div className="grid grid-cols-3 gap-2">
						{["poor", "okay", "good"].map((mood) => (
							<button
								key={mood}
								onClick={() =>
									setFormData({ ...formData, mood })
								}
								className={`p-3 rounded-lg border-2 transition-all capitalize font-medium ${
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

				{/* Notes */}
				<div className="space-y-2">
					<label className="font-semibold text-foreground">
						Additional Notes
					</label>
					<textarea
						value={formData.notes}
						onChange={(e) =>
							setFormData({ ...formData, notes: e.target.value })
						}
						className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground min-h-24 resize-none"
						placeholder="Any other symptoms or concerns?"
					/>
				</div>

				<Button className="w-full" size="lg" onClick={handleSubmit}>
					Submit Check-in
				</Button>
			</Card>

			<div className="space-y-3">
				<h2 className="font-semibold text-lg text-foreground">
					Recent Check-ins
				</h2>
				<div className="space-y-2">
					{checkInHistory.map((checkin, idx) => (
						<Card key={idx} className="p-4 space-y-2">
							<div className="flex justify-between items-start">
								<p className="text-sm font-medium text-muted-foreground">
									{checkin.date}
								</p>
								<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
									Logged
								</span>
							</div>
							<div className="grid grid-cols-3 gap-2 text-sm">
								<div>
									<p className="text-muted-foreground">
										Pain
									</p>
									<p className="font-semibold text-foreground">
										{checkin.pain}/10
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">
										Temp
									</p>
									<p className="font-semibold text-foreground">
										{checkin.temperature}°F
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">
										Mood
									</p>
									<p className="font-semibold text-foreground capitalize">
										{checkin.mood}
									</p>
								</div>
							</div>
							{checkin.notes && (
								<p className="text-sm text-muted-foreground italic">
									"{checkin.notes}"
								</p>
							)}
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}

export default PatientCheckIn;
