import { NavLink } from "react-router";

interface DoctorSidebarProps {
	mobileMenuOpen: boolean;
	setMobileMenuOpen: (open: boolean) => void;
}

function DoctorSidebar({
	mobileMenuOpen,
	setMobileMenuOpen,
}: DoctorSidebarProps) {
	const doctorRoutes = [
		"dashboard",
		"patient-profile",
		"alerts",
		"analytics",
	];

	const formatLabel = (route: string) => {
		return route
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	return (
		<>
			{/* Mobile Menu Button */}
			<button
				onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
				className="md:hidden fixed top-4 left-4 z-50 p-2 hover:bg-muted rounded-lg"
			>
				<span className="text-2xl">☰</span>
			</button>

			{/* Sidebar */}
			<aside
				className={`fixed md:static w-64 h-screen bg-sidebar border-r border-sidebar-border p-6 space-y-8 transform transition-transform md:transform-none ${
					mobileMenuOpen
						? "translate-x-0"
						: "-translate-x-full md:translate-x-0"
				} z-40`}
			>
				<h1 className="text-2xl font-bold text-sidebar-primary">
					CarePath
				</h1>

				<nav className="space-y-2">
					{doctorRoutes.map((route) => (
						<NavLink
							key={route}
							to={`/doctor/${route}`}
							onClick={(e) => {
								if (route === "patient-profile")
									e.preventDefault();
								setMobileMenuOpen(false);
							}}
							className={({ isActive }) =>
								`w-full text-left px-4 py-2 rounded-lg transition-colors ${
									route === "patient-profile"
										? "cursor-not-allowed"
										: " "
								} relative block ${
									isActive
										? "bg-sidebar-primary text-sidebar-primary-foreground"
										: "text-sidebar-foreground hover:bg-sidebar-accent/20"
								}`
							}
						>
							<span className="flex items-center justify-between">
								{formatLabel(route)}
							</span>
						</NavLink>
					))}
				</nav>
			</aside>

			{/* Mobile Overlay */}
			{mobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/50 md:hidden z-30"
					onClick={() => setMobileMenuOpen(false)}
				/>
			)}
		</>
	);
}

export default DoctorSidebar;
