import { useState } from "react";
import { Outlet } from "react-router";
import AdminSidebar from "@/components/AdminSidebar";

function AdminLayout() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<div className="flex min-h-screen">
			<AdminSidebar
				mobileMenuOpen={mobileMenuOpen}
				setMobileMenuOpen={setMobileMenuOpen}
			/>
			<main className="flex-1 p-8 overflow-auto">
				<Outlet />
			</main>
		</div>
	);
}

export default AdminLayout;
