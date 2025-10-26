import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<"patient" | "doctor" | "admin">("patient");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const emailIsValid = (e: string) =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
	const passwordIsValid = (p: string) => p.trim().length >= 6;
	const roleIsValid = (r: string) =>
		["patient", "doctor", "admin"].includes(r);

	const canSubmit =
		emailIsValid(email) &&
		passwordIsValid(password) &&
		roleIsValid(role) &&
		!loading;

	const handleSubmit = async (ev: React.FormEvent) => {
		ev.preventDefault();
		setError(null);
		if (!emailIsValid(email)) {
			setError("Please enter a valid email address.");
			return;
		}
		if (!passwordIsValid(password)) {
			setError("Password must be at least 6 characters.");
			return;
		}
		if (!roleIsValid(role)) {
			setError("Please select a role.");
			return;
		}
		try {
			setLoading(true);
			// Replace with real API call
			await new Promise((res) => setTimeout(res, 900));
			setError(null);
			alert(
				`Logged in (demo) — replace with real submit.\nEmail: ${email}\nRole: ${role}`
			);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
				return;
			}
			setError("Unexpected error. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-white to-primary/40 flex items-center justify-center p-6">
			<Card className="w-full max-w-md">
				<CardHeader className="px-6 pt-6">
					<CardTitle className="text-2xl">Welcome back</CardTitle>
					<p className="text-sm text-slate-500 mt-1">
						Sign in to your account to continue
					</p>
				</CardHeader>

				<CardContent className="px-6 pt-4 pb-2">
					<form
						onSubmit={handleSubmit}
						className="space-y-4"
						noValidate
					>
						<div>
							<Label htmlFor="email" className="mb-2">
								Email
							</Label>
							<div className="relative">
								<span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
									<Mail size={16} />
								</span>
								<Input
									id="email"
									type="email"
									placeholder="you@company.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="pl-10"
									required
									autoComplete="email"
									aria-invalid={
										!emailIsValid(email) && email.length > 0
									}
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="password" className="mb-2">
								Password
							</Label>
							<div className="relative">
								<span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
									<Lock size={16} />
								</span>
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className="pl-10 pr-12"
									required
									autoComplete="current-password"
									aria-invalid={
										!passwordIsValid(password) &&
										password.length > 0
									}
								/>
								<button
									type="button"
									onClick={() => setShowPassword((s) => !s)}
									className="absolute inset-y-0 right-2 flex items-center px-2 text-slate-500 hover:text-slate-700"
									aria-pressed={showPassword}
									title={
										showPassword
											? "Hide password"
											: "Show password"
									}
								>
									{showPassword ? (
										<EyeOff size={16} />
									) : (
										<Eye size={16} />
									)}
								</button>
							</div>
						</div>

						<div>
							<Label htmlFor="role" className="mb-2">
								Role
							</Label>
							<Select
								value={role}
								onValueChange={(val) =>
									setRole(
										val as "patient" | "doctor" | "admin"
									)
								}
							>
								<SelectTrigger id="role" className="w-full">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="patient">
										Patient
									</SelectItem>
									<SelectItem value="doctor">
										Doctor
									</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
								</SelectContent>
							</Select>
            </div>
            
						{error && (
							<div className="text-sm text-red-600">{error}</div>
						)}

						<div className="pt-2">
							<Button
								type="submit"
								className="w-full"
								disabled={!canSubmit}
							>
								{loading ? "Signing in..." : "Sign in"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export default Login;
