import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
	mobileMenuOpen: boolean;
	setMobileMenuOpen: (open: boolean) => void;
}

function AdminSidebar({
	mobileMenuOpen,
	setMobileMenuOpen,
}: AdminSidebarProps) {
	const adminRoutes = [
		{ path: "users", label: "User Management" },
		{ path: "configuration", label: "Platform Configuration" },
	];

	return (
		<>
			{/* Mobile Menu Button */}
			<Button
				onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
				variant="ghost"
				size="icon"
				className="md:hidden fixed top-4 left-4 z-50"
			>
				<span className="text-2xl">☰</span>
			</Button>

			{/* Sidebar */}
			<aside
				className={`fixed md:static w-64 h-screen bg-sidebar border-r border-sidebar-border p-6 space-y-8 transform transition-transform md:transform-none ${
					mobileMenuOpen
						? "translate-x-0"
						: "-translate-x-full md:translate-x-0"
				} z-40`}
			>
				<div>
					<h1 className="text-2xl font-bold text-sidebar-primary">
						SeamlessMD
					</h1>
					<p className="text-xs text-sidebar-foreground/60">
						Administration Portal
					</p>
				</div>

				<nav className="space-y-2">
					{adminRoutes.map((route) => (
						<NavLink
							key={route.path}
							to={`/admin/${route.path}`}
							onClick={() => setMobileMenuOpen(false)}
							className={({ isActive }) =>
								`w-full text-left px-4 py-2 rounded-lg transition-colors block ${
									isActive
										? "bg-sidebar-primary text-sidebar-primary-foreground"
										: "text-sidebar-foreground hover:bg-sidebar-accent/20"
								}`
							}
						>
							{route.label}
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

export default AdminSidebar;
