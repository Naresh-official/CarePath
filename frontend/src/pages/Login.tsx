import React, { useEffect, useState } from "react";
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
import { loginSchema } from "@schemas/auth.schema";
import { toast } from "sonner";
import { z } from "zod";
import axios, { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<"patient" | "doctor" | "admin">("patient");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

	const { user, loading: authLoading, refetchUser } = useAuth();

	useEffect(() => {
		if (user && !authLoading) {
			if (user.role === "patient") {
				navigate("/patient/home");
			} else if (user.role === "doctor") {
				navigate("/doctor/dashboard");
			} else if (user.role === "admin") {
				navigate("/admin/user-management");
			}
		}
	}, [user, navigate, authLoading]);

	const handleSubmit = async (ev: React.FormEvent) => {
		ev.preventDefault();

		if (!email || !password) {
			toast.error("Please fill in all fields");
			return;
		}

		const result = loginSchema.safeParse({ email, password, role });
		if (!result.success) {
			const firstError = z.flattenError(result.error).fieldErrors;
			toast.error(
				firstError.email?.[0] ||
					firstError.password?.[0] ||
					firstError.role?.[0] ||
					"Invalid input"
			);
			return;
		}

		try {
			setLoading(true);

			const { data } = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/auth/login`,
				result.data,
				{ withCredentials: true }
			);

			if (data.success) {
				// Refetch user to update context
				await refetchUser();

				toast.success("Login successful!");

				// Navigate based on role
				if (data.data.role === "patient") {
					navigate("/patient/home", { replace: true });
				} else if (data.data.role === "doctor") {
					navigate("/doctor/dashboard", { replace: true });
				} else if (data.data.role === "admin") {
					navigate("/admin/user-management", { replace: true });
				}
			}
		} catch (err: unknown) {
			if (isAxiosError(err)) {
				if (
					err.response &&
					err.response.data &&
					err.response.data.error
				) {
					toast.error(err.response.data.message);
					return;
				}
			}
			if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error("Unexpected error. Please try again.");
			}
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

						<div className="pt-2">
							<Button
								type="submit"
								className="w-full"
								disabled={loading}
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
