import { type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, ListTree, Soup, Users } from "lucide-react";

interface AdminLayoutProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

function AdminLayout({ title, subtitle, children }: AdminLayoutProps) {
    const navClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
            isActive
                ? "bg-orange-600 text-white shadow-lg shadow-orange-100"
                : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
        }`;

    return (
        <main className="min-h-screen bg-orange-50/15 px-4 py-10">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
                <aside className="h-fit rounded-[2rem] border border-orange-100 bg-white p-4 shadow-sm lg:sticky lg:top-28">
                    <div className="mb-5 rounded-3xl bg-gradient-to-br from-orange-600 to-yellow-400 p-5 text-white">
                        <p className="text-sm font-semibold text-orange-50">Admin Panel</p>
                        <h2 className="mt-2 text-2xl font-black">FoodieHub</h2>
                    </div>

                    <nav className="space-y-2">
                        <NavLink to="/admin" end className={navClass}>
                            <LayoutDashboard size={18} />
                            Dashboard
                        </NavLink>

                        <NavLink to="/admin/categories" className={navClass}>
                            <ListTree size={18} />
                            Categories
                        </NavLink>

                        <NavLink to="/admin/foods" className={navClass}>
                            <Soup size={18} />
                            Foods
                        </NavLink>

                        <NavLink to="/admin/users" className={navClass}>
                            <Users size={18} />
                            Users
                        </NavLink>
                    </nav>

                    <Link
                        to="/"
                        className="mt-5 block rounded-2xl border border-orange-100 px-4 py-3 text-center text-sm font-bold text-slate-600 hover:bg-orange-50"
                    >
                        View Storefront
                    </Link>
                </aside>

                <section>
                    <div className="mb-3">
                        <h1 className="text-3xl font-weight tracking-tight text-slate-950 md:text-4xl">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-middle leading-6 text-slate-550">
                            {subtitle}
                        </p>
                    </div>

                    {children}
                </section>
            </div>
        </main>
    );
}

export default AdminLayout;