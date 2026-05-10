import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryApi } from "../../api/categoryApi";
import { foodApi } from "../../api/foodApi";
import type { Category } from "../../types";

const categoryIcons = ["🥗", "🍕","🍔", "🍛", "🍝", , "🍰", "🍟", "🥤"];

function CategoryShowcase() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const [categoryData, availableFoods] = await Promise.all([
                categoryApi.getAll(),
                foodApi.getAvailable(),
            ]);

            const availableCategoryIds = new Set(
                availableFoods.map((food) => food.categoryId)
            );

            setCategories(
                categoryData.filter((category) =>
                    availableCategoryIds.has(category.categoryId)
                )
            );
        } catch {
            setError("Unable to load categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <section className="px-4 py-4 md:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-2xl font-bold text-orange-600 text-left">
                            Popular Categories
                        </p>
                        <p className="mt-3 max-w-2xl text-slate-500">
                            Explore food categories and quickly find what
                            you want to order.
                        </p>
                    </div>

                    <Link
                        to="/foods"
                        className="w-fit rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-700"
                    >
                        View Full Menu
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-56 animate-pulse rounded-[2rem] bg-orange-50"
                            />
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="rounded-[2rem] border border-orange-100 bg-orange-50/50 p-10 text-center">
                        <h3 className="text-xl font-black text-slate-950">
                            No available categories
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Categories will appear here when they have available foods.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {categories.slice(0, 8).map((category, index) => (
                            <Link
                                key={category.categoryId}
                                to="/foods"
                                className="group rounded-[2rem] border border-orange-100 bg-orange-50/60 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-md hover:shadow-orange-100 flex flex-row items-start gap-5"
                            >
                                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white text-4xl shadow-sm transition group-hover:scale-105">
                                    {categoryIcons[index % categoryIcons.length]}
                                </div>
                                <div>
                                    <h3 className="mt-6 text-xl font-black text-slate-950">
                                        {category.categoryName}
                                    </h3>

                                    <p className="mt-2 line-clamp-2 text-sm leading-6 !text-slate-700">
                                        {category.description ||
                                            "Explore delicious food items from this category."}
                                    </p>
                                </div>

                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default CategoryShowcase;
