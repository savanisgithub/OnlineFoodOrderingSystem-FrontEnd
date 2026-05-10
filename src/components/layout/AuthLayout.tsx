import type { ReactNode } from "react";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
    return (
        <main className="relative min-h-[calc(100vh-90px)] flex items-center justify-center overflow-hidden px-4 py-8">
            <div className="w-full grid max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-orange-100">
                {/* <div className="relative hidden overflow-hidden bg-gradient-to-br from-orange-600 to-yellow-400 p-10 text-white lg:block">
                    <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-black/10 blur-3xl" />

                    <div className="relative z-10 flex h-full flex-col justify-between">
                        <div className="flex items-center gap-3">
                            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur">
                                <UtensilsCrossed />
                            </div>
                            <div>
                                <h2 className="text-xl font-black">FoodieHub</h2>
                                <p className="text-sm text-orange-50">
                                    Fresh food, fast ordering
                                </p>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-5xl font-black leading-tight">
                                Taste the best meals in minutes.
                            </h1>
                            <p className="mt-5 max-w-md text-orange-50">
                                Sign in to manage your cart, place orders, track payments,
                                and enjoy a smooth food ordering experience.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white/20 p-5 backdrop-blur">
                            <p className="text-sm font-semibold">
                                “A clean, secure, and simple ordering system built with React,
                                TypeScript, Tailwind CSS, and Spring Boot.”
                            </p>
                        </div>
                    </div>
                </div> */}

                <div className="p-8 sm:p-12">
                    <div className="space-y-8">
                        <div className=" border-b border-orange-300 pb-7">
                            <h1 className="text-xl sm:text-3xl font-black !text-slate-700 !m-4">{title}</h1>
                            <p className="text-sm sm:text-base leading-6 text-slate-600">{subtitle}</p>
                        </div>

                        <div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default AuthLayout;
