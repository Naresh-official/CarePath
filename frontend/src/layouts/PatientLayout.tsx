import Footer from "@/components/Footer";
import PatientHeader from "@/components/PatientHeader";
import { Outlet } from "react-router";

function PatientLayout() {
	return (
		<div>
			<PatientHeader />
			<Outlet />
			<Footer />
		</div>
	);
}

export default PatientLayout;
