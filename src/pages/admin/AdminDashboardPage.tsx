import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListTree, Soup, Users } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { categoryApi } from "../../api/categoryApi";
import { foodApi } from "../../api/foodApi";
import { userApi } from "../../api/usersApi";


function AdminDashboardPage() {
    const [categoryCount, setCategoryCount] = useState(0);
    const [foodCount, setFoodCount] = useState(0);
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        const loadStats = async () => {
            const [categories, foods, users] = await Promise.all([
                categoryApi.getAll(),
                foodApi.getAll(),
                userApi.getAll(),
            ]);

            setCategoryCount(categories.length);
            setFoodCount(foods.length);
            setUserCount(users.length);
        };

        loadStats().catch(() => {
            setCategoryCount(0);
            setFoodCount(0);
            setUserCount(0);
        });
    }, []);

    const cards = [
        {
            title: "Categories",
            count: categoryCount,
            icon: ListTree,
            link: "/admin/categories",
            description: "Manage menu categories",
        },
        {
            title: "Foods",
            count: foodCount,
            icon: Soup,
            link: "/admin/foods",
            description: "Manage food items",
        },
        {
            title: "Users",
            count: userCount,
            icon: Users,
            link: "/admin/users",
            description: "Manage customers and admins",
        },
    ];

    return (
        <AdminLayout
            title="Admin Dashboard"
            subtitle="Manage the complete online food ordering system from one place."
        >
            <div className="grid gap-5 md:grid-cols-3">
                {cards.map((card) => (
                    <Link
                        key={card.title}
                        to={card.link}
                        className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100"
                    >
                        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-100 text-orange-600">
                            <card.icon size={26} />
                        </div>

                        <p className="mt-6 text-sm font-bold text-slate-500">{card.title}</p>
                        <h2 className="mt-1 text-4xl font-black text-slate-950">{card.count}</h2>
                        <p className="mt-2 text-sm text-slate-500">{card.description}</p>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}

export default AdminDashboardPage;