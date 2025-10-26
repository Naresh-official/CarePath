import FeatureTabs from "@/components/FeatureTabs";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Outcomes from "@/components/Outcomes";
import PlatformFeatures from "@/components/PlatformFeatures";
import Roles from "@/components/Roles";

export default function Landing() {
	return (
		<div
			className="bg-white text-gray-800 antialiased"
			style={{ fontFamily: "'Inter', sans-serif" }}
		>
			<Header />
			<main>
				<Hero />
				<div className="h-80 bg-linear-to-b from-gray-50 to-primary/20 backdrop-blur-3xl"></div>
				<Outcomes />
				<div className="h-80 bg-linear-to-b from-primary/20 to-gray-50 backdrop-blur-3xl"></div>
				<Roles />
				<div className="h-80 bg-linear-to-b from-gray-50 to-primary/30 backdrop-blur-3xl"></div>
				<PlatformFeatures />
				<div className="h-80 bg-linear-to-b from-primary/30 to-gray-50 backdrop-blur-3xl"></div>
				<FeatureTabs />
			</main>
			<Footer />
		</div>
	);
}
