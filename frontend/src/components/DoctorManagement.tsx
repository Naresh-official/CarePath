import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface IDoctor {
	_id: string;
	userId: {
		firstName: string;
		lastName: string;
		email: string;
		_id: string;
		isActive: boolean;
	};
	role: string;
	phone?: string;
	specialization?: string;
	licenseNumber?: string;
}

export default function DoctorManagement() {
	const [doctors, setDoctors] = useState<IDoctor[]>([]);
	const [showNewDoctorForm, setShowNewDoctorForm] = useState(false);
	const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
	const [newDoctorForm, setNewDoctorForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		role: "",
		phone: "",
		specialization: "",
		licenseNumber: "",
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		itemsPerPage: 10,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isFetchingDetails, setIsFetchingDetails] = useState(false);
	const [deletingDoctorId, setDeletingDoctorId] = useState<string | null>(
		null
	);
	const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);

	useEffect(() => {
		const fetchDoctors = async () => {
			setIsLoading(true);
			setIsError(false);
			setError(null);
			try {
				const { data } = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/admin/doctors`,
					{
						withCredentials: true,
						params: { page: currentPage },
					}
				);
				setDoctors(data.data.doctors || []);
				setPagination(
					data.data.pagination || {
						currentPage: 1,
						totalPages: 1,
						totalItems: 0,
						itemsPerPage: 10,
					}
				);
			} catch (err: unknown) {
				setIsError(true);
				if (axios.isAxiosError(err)) {
					setError(
						new Error(err?.response?.data?.message || err.message)
					);
				} else if (err instanceof Error) {
					setError(err);
				} else {
					setError(new Error("An unknown error occurred"));
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchDoctors();
	}, [currentPage]);

	const fetchDoctorDetails = async (doctorId: string) => {
		setIsFetchingDetails(true);
		try {
			const { data } = await axios.get(
				`${import.meta.env.VITE_BACKEND_URL}/admin/doctor/${doctorId}`,
				{
					withCredentials: true,
				}
			);
			const doctorData = data.data;
			setNewDoctorForm({
				firstName: doctorData.userId.firstName || "",
				lastName: doctorData.userId.lastName || "",
				email: doctorData.userId.email || "",
				password: "",
				role: doctorData.role || "",
				phone: doctorData.phone || "",
				specialization: doctorData.specialization || "",
				licenseNumber: doctorData.licenseNumber || "",
			});
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				toast.error(
					err?.response?.data?.message ||
						err.message ||
						"Failed to fetch doctor details"
				);
			} else if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error("An unknown error occurred");
			}
		} finally {
			setIsFetchingDetails(false);
		}
	};

	const addDoctor = async (doctorData: typeof newDoctorForm) => {
		setIsSubmitting(true);
		try {
			const payload = {
				...doctorData,
				phone: doctorData.phone || undefined,
				specialization: doctorData.specialization || undefined,
				licenseNumber: doctorData.licenseNumber || undefined,
			};

			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/admin/doctor`,
				payload,
				{
					withCredentials: true,
				}
			);

			toast.success("Doctor added successfully!");
			resetForm();
			setShowNewDoctorForm(false);
			const { data } = await axios.get(
				`${import.meta.env.VITE_BACKEND_URL}/admin/doctors`,
				{
					withCredentials: true,
					params: { page: currentPage },
				}
			);
			setDoctors(data.data || []);
			setPagination(
				data.pagination || {
					currentPage: 1,
					totalPages: 1,
					totalItems: 0,
					itemsPerPage: 10,
				}
			);
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				toast.error(
					err?.response?.data?.message ||
						err.message ||
						"Failed to add doctor"
				);
			} else if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error("An unknown error occurred");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const updateDoctor = async (
		doctorId: string,
		doctorData: typeof newDoctorForm
	) => {
		setIsSubmitting(true);
		try {
			const payload = {
				...doctorData,
				phone: doctorData.phone || undefined,
				specialization: doctorData.specialization || undefined,
				licenseNumber: doctorData.licenseNumber || undefined,
				password: doctorData.password || undefined,
			};

			await axios.patch(
				`${import.meta.env.VITE_BACKEND_URL}/admin/doctor/${doctorId}`,
				payload,
				{
					withCredentials: true,
				}
			);

			toast.success("Doctor updated successfully!");
			resetForm();
			setEditingDoctorId(null);
			const { data } = await axios.get(
				`${import.meta.env.VITE_BACKEND_URL}/admin/doctors`,
				{
					withCredentials: true,
					params: { page: currentPage },
				}
			);
			setDoctors(data.data || []);
			setPagination(
				data.pagination || {
					currentPage: 1,
					totalPages: 1,
					totalItems: 0,
					itemsPerPage: 10,
				}
			);
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				toast.error(
					err?.response?.data?.message ||
						err.message ||
						"Failed to update doctor"
				);
			} else if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error("An unknown error occurred");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteClick = (doctorId: string) => {
		setDoctorToDelete(doctorId);
	};

	const confirmDelete = async () => {
		if (!doctorToDelete) return;

		setDeletingDoctorId(doctorToDelete);
		try {
			await axios.delete(
				`${
					import.meta.env.VITE_BACKEND_URL
				}/admin/doctor/${doctorToDelete}`,
				{
					withCredentials: true,
				}
			);

			toast.success("Doctor deleted successfully!");
			setDoctorToDelete(null);
			const { data } = await axios.get(
				`${import.meta.env.VITE_BACKEND_URL}/admin/doctors`,
				{
					withCredentials: true,
					params: { page: currentPage },
				}
			);
			setDoctors(data.data || []);
			setPagination(
				data.pagination || {
					currentPage: 1,
					totalPages: 1,
					totalItems: 0,
					itemsPerPage: 10,
				}
			);
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				toast.error(
					err?.response?.data?.message ||
						err.message ||
						"Failed to delete doctor"
				);
			} else if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error("An unknown error occurred");
			}
		} finally {
			setDeletingDoctorId(null);
		}
	};

	const resetForm = () => {
		setNewDoctorForm({
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			role: "",
			phone: "",
			specialization: "",
			licenseNumber: "",
		});
	};

	const handleAddDoctor = () => {
		if (
			!newDoctorForm.firstName.trim() ||
			!newDoctorForm.lastName.trim() ||
			!newDoctorForm.email.trim() ||
			!newDoctorForm.role.trim()
		) {
			toast.error("Please fill in all required fields");
			return;
		}

		if (!editingDoctorId && !newDoctorForm.password.trim()) {
			toast.error("Password is required");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newDoctorForm.email)) {
			toast.error("Please enter a valid email address");
			return;
		}

		if (newDoctorForm.password && newDoctorForm.password.length < 6) {
			toast.error("Password must be at least 6 characters long");
			return;
		}

		if (editingDoctorId) {
			updateDoctor(editingDoctorId, newDoctorForm);
		} else {
			addDoctor(newDoctorForm);
		}
	};

	const handleEditDoctor = (doctorId: string) => {
		setEditingDoctorId(doctorId);
		fetchDoctorDetails(doctorId);
	};

	const handleCloseDialog = () => {
		setShowNewDoctorForm(false);
		setEditingDoctorId(null);
		resetForm();
	};

	if (isError) {
		return (
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-semibold text-foreground">
						Doctor Management & Verification
					</h2>
				</div>
				<Card className="p-6">
					<div className="text-center text-red-600">
						<p className="font-semibold mb-2">
							Error loading doctors
						</p>
						<p className="text-sm">
							{error?.message || "An unexpected error occurred"}
						</p>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-semibold text-foreground">
					Doctor Management & Verification
				</h2>
				<Button onClick={() => setShowNewDoctorForm(true)}>
					Add New Doctor
				</Button>
			</div>

			<Dialog
				open={showNewDoctorForm || editingDoctorId !== null}
				onOpenChange={(open) => {
					if (!open) {
						handleCloseDialog();
					}
				}}
			>
				<DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-neutral-500">
					<DialogHeader>
						<DialogTitle>
							{editingDoctorId ? "Edit Doctor" : "Add New Doctor"}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						{isFetchingDetails ? (
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-10 w-full" />
									</div>
									<div className="space-y-2">
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-10 w-full" />
									</div>
								</div>
								<div className="space-y-2">
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-10 w-full" />
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Skeleton className="h-4 w-12" />
										<Skeleton className="h-10 w-full" />
									</div>
									<div className="space-y-2">
										<Skeleton className="h-4 w-16" />
										<Skeleton className="h-10 w-full" />
									</div>
								</div>
							</div>
						) : (
							<>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="firstName">
											First Name *
										</Label>
										<Input
											id="firstName"
											value={newDoctorForm.firstName}
											onChange={(e) =>
												setNewDoctorForm({
													...newDoctorForm,
													firstName: e.target.value,
												})
											}
											placeholder="John"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="lastName">
											Last Name *
										</Label>
										<Input
											id="lastName"
											value={newDoctorForm.lastName}
											onChange={(e) =>
												setNewDoctorForm({
													...newDoctorForm,
													lastName: e.target.value,
												})
											}
											placeholder="Doe"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email *</Label>
									<Input
										id="email"
										type="email"
										value={newDoctorForm.email}
										onChange={(e) =>
											setNewDoctorForm({
												...newDoctorForm,
												email: e.target.value,
											})
										}
										placeholder="doctor@hospital.com"
									/>
								</div>

								{!editingDoctorId && (
									<div className="space-y-2">
										<Label htmlFor="password">
											Password *
										</Label>
										<Input
											id="password"
											type="password"
											value={newDoctorForm.password}
											onChange={(e) =>
												setNewDoctorForm({
													...newDoctorForm,
													password: e.target.value,
												})
											}
											placeholder="Minimum 6 characters"
										/>
									</div>
								)}

								<div className="space-y-2">
									<Label htmlFor="role">Role *</Label>
									<Select
										value={newDoctorForm.role}
										onValueChange={(value) =>
											setNewDoctorForm({
												...newDoctorForm,
												role: value,
											})
										}
									>
										<SelectTrigger id="role">
											<SelectValue placeholder="Select Role" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Surgeon">
												Surgeon
											</SelectItem>
											<SelectItem value="Cardiologist">
												Cardiologist
											</SelectItem>
											<SelectItem value="Nurse">
												Nurse
											</SelectItem>
											<SelectItem value="Care Coordinator">
												Care Coordinator
											</SelectItem>
											<SelectItem value="Physical Therapist">
												Physical Therapist
											</SelectItem>
											<SelectItem value="Anesthesiologist">
												Anesthesiologist
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="phone">Phone</Label>
										<Input
											id="phone"
											type="tel"
											value={newDoctorForm.phone}
											onChange={(e) =>
												setNewDoctorForm({
													...newDoctorForm,
													phone: e.target.value,
												})
											}
											placeholder="+1-555-0101"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="licenseNumber">
											License Number
										</Label>
										<Input
											id="licenseNumber"
											value={newDoctorForm.licenseNumber}
											onChange={(e) =>
												setNewDoctorForm({
													...newDoctorForm,
													licenseNumber:
														e.target.value,
												})
											}
											placeholder="SRG-2018-001"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="specialization">
										Specialization
									</Label>
									<Input
										id="specialization"
										value={newDoctorForm.specialization}
										onChange={(e) =>
											setNewDoctorForm({
												...newDoctorForm,
												specialization: e.target.value,
											})
										}
										placeholder="e.g., Cardiovascular Surgery"
									/>
								</div>
							</>
						)}
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={handleCloseDialog}
							disabled={isSubmitting || isFetchingDetails}
						>
							Cancel
						</Button>
						<Button
							onClick={handleAddDoctor}
							disabled={isSubmitting || isFetchingDetails}
						>
							{isSubmitting
								? editingDoctorId
									? "Updating..."
									: "Adding..."
								: editingDoctorId
								? "Update Doctor"
								: "Add Doctor"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{isLoading ? (
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<Card key={i} className="p-4">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div className="flex-1 space-y-3">
									<Skeleton className="h-6 w-48" />
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-40" />
								</div>
								<div className="flex gap-2">
									<Skeleton className="h-9 w-28" />
									<Skeleton className="h-9 w-20" />
								</div>
							</div>
						</Card>
					))}
				</div>
			) : (
				<div className="space-y-3">
					{doctors.map((doctor) => (
						<Card key={doctor._id} className="p-4">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div className="flex-1">
									<h3 className="font-semibold text-foreground mb-1">
										{doctor.userId.firstName}{" "}
										{doctor.userId.lastName}
									</h3>
									<p className="text-sm text-muted-foreground">
										{doctor.role}
									</p>
									<p className="text-sm text-muted-foreground">
										{doctor.userId.email}
									</p>
									{doctor.specialization && (
										<p className="text-sm text-muted-foreground">
											Specialization:{" "}
											{doctor.specialization}
										</p>
									)}
									<span
										className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
											doctor.userId.isActive
												? "bg-green-100 text-green-800"
												: "bg-gray-100 text-gray-800"
										}`}
									>
										{doctor.userId.isActive
											? "Active"
											: "Inactive"}
									</span>
								</div>
								<div className="flex gap-2">
									<Button
										size="sm"
										variant="outline"
										onClick={() =>
											handleEditDoctor(doctor._id)
										}
									>
										<Pencil className="w-4 h-4 mr-2" />
										Edit
									</Button>
									<Button
										size="sm"
										variant="destructive"
										onClick={() =>
											handleDeleteClick(doctor._id)
										}
										disabled={
											deletingDoctorId === doctor._id
										}
									>
										<Trash2 className="w-4 h-4 mr-2" />
										{deletingDoctorId === doctor._id
											? "Deleting..."
											: "Delete"}
									</Button>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}

			{pagination.totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 pt-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							setCurrentPage((prev) => Math.max(1, prev - 1))
						}
						disabled={currentPage === 1}
					>
						Previous
					</Button>
					<div className="flex items-center gap-1">
						{Array.from(
							{ length: pagination.totalPages },
							(_, i) => i + 1
						).map((page) => (
							<Button
								key={page}
								variant={
									currentPage === page ? "default" : "outline"
								}
								size="sm"
								onClick={() => setCurrentPage(page)}
								className="min-w-10"
							>
								{page}
							</Button>
						))}
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							setCurrentPage((prev) =>
								Math.min(pagination.totalPages, prev + 1)
							)
						}
						disabled={currentPage === pagination.totalPages}
					>
						Next
					</Button>
					<span className="text-sm text-muted-foreground ml-4">
						Page {pagination.currentPage} of {pagination.totalPages}{" "}
						({pagination.totalItems} total doctors)
					</span>
				</div>
			)}

			<AlertDialog
				open={doctorToDelete !== null}
				onOpenChange={(open) => !open && setDoctorToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently
							delete the doctor and all associated data from the
							system.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deletingDoctorId !== null}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							disabled={deletingDoctorId !== null}
							className="bg-destructive text-white hover:bg-destructive/90"
						>
							{deletingDoctorId ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
