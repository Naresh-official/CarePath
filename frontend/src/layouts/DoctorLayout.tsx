import { useState } from "react";
import { Outlet } from "react-router";
import DoctorSidebar from "@/components/DoctorSidebar";

function DoctorLayout() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<div>
			<div className="flex h-screen">
				<DoctorSidebar
					mobileMenuOpen={mobileMenuOpen}
					setMobileMenuOpen={setMobileMenuOpen}
				/>
				<main className="flex-1 overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

export default DoctorLayout;
