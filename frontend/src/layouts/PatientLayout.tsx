import PatientHeader from "@/components/PatientHeader";
import { Outlet } from "react-router";

function PatientLayout() {
	return (
		<div>
			<PatientHeader />
			<Outlet />
		</div>
	);
}

export default PatientLayout;
