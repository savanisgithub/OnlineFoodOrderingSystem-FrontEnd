import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../../components/ui/Button";
import BannerImage from "../../assets/bannerImage.png"

function Banner() {
    return (
        
        <div className="mx-auto grid min-h-[50vh] max-w-8xl items-top px-4 md:grid-cols-2 md:px-8 md:py-1">
            <div className="relative z-10 flex flex-col justify-flex-start">
                <div className="inline-flex w-fit items-center px-2 text-sm font-bold text-orange-500 shadow-sm">
                    Delicious meals delivered with care
                </div>

                <h1 className="text-3xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">                
                    Order your favorite food in minutes.
                </h1>

                <p className="mt-2 max-w-xl text-base leading-8 text-slate-500 sm:text-md">                
                    Browse tasty meals, add them to your cart, place orders, and track
                    everything through a clean food ordering experience.
                </p>

                <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link to="/foods">
                        <Button>
                            Browse Foods <ArrowRight className="ml-2" size={18} />
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button variant="secondary">Create Account</Button>
                    </Link>
                </div>
            </div>

            <div className="relative z-10">
                <img
                    src={BannerImage}
                    alt="Delicious spaghetti dish"
                    className="w-full drop-shadow-2xl"
                />
            </div>
        </div>
    )
}

export default Banner
