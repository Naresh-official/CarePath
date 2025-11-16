import { NavLink } from "react-router";

function PatientHeader() {
	const headerRoutes = [
		"home",
		"tasks",
		"checkin",
		"messages",
		"reports",
		"profile",
	];

	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 flex justify-around md:static md:border-b md:border-t-0 md:px-6 md:py-4 overflow-x-auto">
			{headerRoutes.map((route) => {
				const label = route.charAt(0).toUpperCase() + route.slice(1);
				return (
					<NavLink
						key={route}
						to={route}
						className={({ isActive }) =>
							`flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors ${
								isActive
									? "text-primary bg-primary/10"
									: "text-muted-foreground hover:text-foreground"
							}`
						}
					>
						{label}
					</NavLink>
				);
			})}
		</nav>
	);
}

export default PatientHeader;
