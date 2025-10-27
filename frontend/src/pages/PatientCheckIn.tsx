import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

function PatientCheckIn() {
	const [formData, setFormData] = useState<{
		pain: number;
		temperature: number;
		bp: string;
		mood: string;
		notes: string;
		image: File | null;
	}>({
		pain: 0,
		temperature: 36.5,
		bp: "120/80",
		mood: "good",
		notes: "",
		image: null,
	});
	const [submitted, setSubmitted] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [checkInHistory, setCheckInHistory] = useState<
		{
			date: string;
			pain: number;
			temperature: number;
			bp: string;
			mood: string;
			notes: string;
			image: File | null;
		}[]
	>([
		{
			date: "Today at 2:30 PM",
			pain: 4,
			temperature: 98.6,
			bp: "118/78",
			mood: "good",
			notes: "Feeling better after rest",
			image: null,
		},
		{
			date: "Yesterday at 8:00 AM",
			pain: 6,
			temperature: 99.1,
			bp: "125/82",
			mood: "okay",
			notes: "Some discomfort in the morning",
			image: null,
		},
	]);

	const handleSubmit = () => {
		setCheckInHistory([
			{
				date: new Date().toLocaleString(),
				...formData,
				image: formData.image || null,
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

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setFormData({
			...formData,
			image: file || null,
		});

		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setImagePreview(null);
		}
	};

	const clearImage = () => {
		setFormData({ ...formData, image: null });
		setImagePreview(null);
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
						className={`w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer ${
							formData.pain <= 3
								? "accent-green-500"
								: formData.pain <= 7
								? "accent-yellow-500"
								: "accent-red-500"
						}`}
					/>
					<div className="flex justify-between text-xs text-muted-foreground">
						<span>No Pain</span>
						<span>Severe Pain</span>
					</div>
				</div>

				{/* Temperature */}
				{/* TODO : Set upper and lower limit */}
				<div className="space-y-2">
					<label className="font-semibold text-foreground">
						Temperature (°C)
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
						placeholder="36.5"
					/>
				</div>

				{/* Blood Pressure */}
				<div className="space-y-2">
					<label className="font-semibold text-foreground">
						Blood Pressure (mmHg)
					</label>
					<input
						type="text"
						value={formData.bp}
						onChange={(e) =>
							setFormData({
								...formData,
								bp: e.target.value,
							})
						}
						className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
						placeholder="120/80"
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

				{/* Image Upload */}
				<div className="space-y-2">
					<label className="font-semibold text-foreground">
						Upload Image
					</label>
					{imagePreview ? (
						<div className="space-y-2">
							<img
								src={imagePreview}
								alt="Preview"
								className="w-full h-64 object-cover rounded-lg border border-border"
							/>
							<div className="flex gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={clearImage}
									className="flex-1"
								>
									Remove Image
								</Button>
								<label className="flex-1">
									<input
										type="file"
										accept=".jpeg,.jpg,.png,.heic,image/jpeg,image/png,image/heic"
										onChange={handleImageChange}
										className="hidden"
									/>
									<Button
										type="button"
										variant="outline"
										className="w-full cursor-pointer"
										asChild
									>
										<span>Change Image</span>
									</Button>
								</label>
							</div>
						</div>
					) : (
						<input
							type="file"
							accept=".jpeg,.jpg,.png,.heic,image/jpeg,image/png,image/heic"
							onChange={handleImageChange}
							className="w-full p-3 border border-border rounded-lg bg-input text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
						/>
					)}
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
									<p className="text-muted-foreground">BP</p>
									<p className="font-semibold text-foreground">
										{checkin.bp}
									</p>
								</div>
							</div>
							<div className="text-sm">
								<p className="text-muted-foreground">Mood</p>
								<p className="font-semibold text-foreground capitalize">
									{checkin.mood}
								</p>
							</div>
							{checkin.image && (
								<div className="text-sm">
									<p className="text-muted-foreground">
										Image
									</p>
									<p className="font-semibold text-foreground">
										{checkin.image?.name}
									</p>
								</div>
							)}
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
