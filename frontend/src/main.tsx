import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Landing from "./pages/Landing.tsx";
import Login from "./pages/Login.tsx";
import PatientLayout from "./layouts/PatientLayout.tsx";
import DoctorLayout from "./layouts/DoctorLayout.tsx";
import PatientHome from "./pages/PatientHome.tsx";
import PatientTasks from "./pages/PatientTasks.tsx";
import PatientCheckIn from "./pages/PatientCheckIn.tsx";
import PatientEducation from "./pages/PatientEducation.tsx";
import Messages from "./pages/Messages.tsx";
import PatientHealthReport from "./pages/PatientHealthReport.tsx";
import DoctorDashboard from "./pages/DoctorDashboard.tsx";
import PatientProfile from "./pages/PatientProfile.tsx";
import Alerts from "./pages/Alerts.tsx";
import Analytics from "./pages/Analytics.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import UserManagementDashboard from "./pages/UserManagementDashboard.tsx";
import PlatformConfiguration from "./pages/PlatformConfiguration.tsx";
import NotFound from "./pages/NotFound.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		children: [
			{
				index: true,
				element: <Landing />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/patient",
				element: <PatientLayout />,
				children: [
					{ path: "home", element: <PatientHome /> },
					{ path: "tasks", element: <PatientTasks /> },
					{ path: "checkin", element: <PatientCheckIn /> },
					{ path: "education", element: <PatientEducation /> },
					{ path: "messages", element: <Messages /> },
					{ path: "reports", element: <PatientHealthReport /> },
				],
			},
			{
				path: "/doctor",
				element: <DoctorLayout />,
				children: [
					{ path: "dashboard", element: <DoctorDashboard /> },
					{ path: "patient-profile", element: <PatientProfile /> },
					{ path: "alerts", element: <Alerts /> },
					{ path: "analytics", element: <Analytics /> },
				],
			},
			{
				path: "/admin",
				element: <AdminLayout />,
				children: [
					{ path: "users", element: <UserManagementDashboard /> },
					{
						path: "configuration",
						element: <PlatformConfiguration />,
					},
				],
			},
			{
				path: "*",
				element: <NotFound />,
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
