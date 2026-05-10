import { CreditCard, Search, ShoppingCart, Truck } from "lucide-react";

const steps = [
    {
        title: "Browse Foods",
        description: "Explore available meals and filter by category.",
        icon: Search,
    },
    {
        title: "Add to Cart",
        description: "Choose your favorite meals and adjust quantities.",
        icon: ShoppingCart,
    },
    {
        title: "Place Order",
        description: "Confirm your cart and submit your order instantly.",
        icon: Truck,
    },
    {
        title: "Pay Securely",
        description: "Create payment and complete your transaction.",
        icon: CreditCard,
    },
];

function HowItWorks() {
    return (
        <section className="px-4 py-8 md:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <p className="text-2xl font-bold text-orange-600 ">How It Works</p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                        Order food in four simple steps
                    </h2>
                    <p className="mt-3 text-slate-500">
                        A simple customer flow designed for a smooth online ordering
                        experience.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-4">
                    {steps.map((step, index) => (
                        <div
                            key={step.title}
                            className="relative rounded-[2rem] border border-orange-100 bg-white p-6 text-center shadow-sm"
                        >
                            <div className="absolute right-5 top-5 text-4xl font-black text-orange-100">
                                {index + 1}
                            </div>

                            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-orange-100 text-orange-600">
                                <step.icon size={28} />
                            </div>

                            <h3 className="mt-6 text-lg font-black text-slate-950">
                                {step.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;