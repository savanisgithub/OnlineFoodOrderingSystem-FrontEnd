import { Clock, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

const features = [
    {
        title: "Fresh menu items",
        description: "Foods are managed by admins and shown with availability status.",
        icon: Sparkles,
    },
    {
        title: "Easy cart control",
        description: "Add, update, remove, and clear cart items with a smooth flow.",
        icon: HeartHandshake,
    },
    {
        title: "Secure access",
        description: "JWT-based authentication protects cart, order, and payment pages.",
        icon: ShieldCheck,
    },
    {
        title: "Order tracking",
        description: "Customers can view order history and status updates easily.",
        icon: Clock,
    },
];

function WhyChooseUs() {
    return (
        <section className="bg-slate-950 px-4 py-5 text-white md:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <p className="text-2xl font-bold text-orange-400">Why Choose Us</p>

                        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
                            Built for a better food ordering experience.
                        </h2>

                        <p className="mt-5 max-w-xl leading-8 text-slate-300">
                            FoodieHub combines a clean interface with a complete backend
                            ordering flow, making it easy for customers to browse, order, pay,
                            and track their food.
                        </p>

                        <div className="mt-8 grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-3xl font-black text-orange-400">4+</p>
                                <p className="text-sm text-slate-400">Core modules</p>
                            </div>

                            <div>
                                <p className="text-3xl font-black text-orange-400">24/7</p>
                                <p className="text-sm text-slate-400">Online access</p>
                            </div>

                            <div>
                                <p className="text-3xl font-black text-orange-400">100%</p>
                                <p className="text-sm text-slate-400">Responsive UI</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10"
                            >
                                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-500/20 text-orange-400">
                                    <feature.icon size={26} />
                                </div>

                                <h3 className="mt-5 text-lg font-black">{feature.title}</h3>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;