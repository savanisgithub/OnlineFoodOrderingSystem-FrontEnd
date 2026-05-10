import Banner from "./Banner";
import CategoryShowcase from "./CategoryShowcase";
import FeaturedFoods from "./FeaturedFoods";
import HowItWorks from "./HowItWoeks";
import WhyChooseUs from "./WhyChooseUs";

export default function HomePage() {
    return (
        <main className="min-h-screen overflow-hidden">
            <section className="relative overflow-hidden">
                <Banner />
            </section>

            <CategoryShowcase />

            <FeaturedFoods />

            <HowItWorks />

            <WhyChooseUs />
        </main>
    );
}