import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { AxiosError } from "axios";
import { foodApi } from "../api/foodApi";
import { categoryApi } from "../api/categoryApi";
import { cartApi } from "../api/cartApi";
import type { Category, FoodItem } from "../types";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";
import EmptyState from "../components/ui/EmptyState";

function FoodsPage() {
    const { user, isAuthenticated } = useAuth();
    const { refreshCartCount } = useCart();

    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const [foodData, categoryData] = await Promise.all([
                foodApi.getAll(),
                categoryApi.getAll(),
            ]);

            setFoods(foodData);
            setCategories(categoryData);
        } catch {
            setError("Failed to load food items. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredFoods = useMemo(() => {
        return foods.filter((food) => {
            const matchesCategory =
                selectedCategory === "ALL" || food.categoryId === selectedCategory;

            const matchesSearch =
                food.foodName.toLowerCase().includes(search.toLowerCase()) ||
                food.description?.toLowerCase().includes(search.toLowerCase()) ||
                food.categoryName?.toLowerCase().includes(search.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [foods, selectedCategory, search]);

    const availableCategories = useMemo(() => {
        const foodCategoryIds = new Set(foods.map((food) => food.categoryId));
        return categories.filter((category) => foodCategoryIds.has(category.categoryId));
    }, [foods, categories]);

    const handleAddToCart = async (food: FoodItem) => {
        setError("");
        setSuccess("");

        if (!isAuthenticated || !user) {
            setError("Please sign in before adding items to your cart.");
            return;
        }

        if (food.status !== "AVAILABLE") {
            setError("This food item is currently out of stock.");
            return;
        }

        try {
            setActionLoading(food.foodId);
            await cartApi.addItem(user.userId, food.foodId, 1);
            await refreshCartCount(user.userId);
            setSuccess(`${food.foodName} added to cart`);
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to add item to cart.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <main className="min-h-screen px-4">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <p className="mt-3 max-w-2xl text-slate-500">
                            Browse foods by category, search your favorites, and add items to your cart.
                        </p>
                    </div>

                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search foods..."
                            className="w-full rounded-2xl border border-orange-100 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-5 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
                        {success}
                    </div>
                )}

                <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
                    <button
                        onClick={() => setSelectedCategory("ALL")}
                        className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition ${
                            selectedCategory === "ALL"
                                ? "bg-orange-600 text-white"
                                : "bg-white text-slate-600 hover:bg-orange-100"
                        }`}
                    >
                        All Foods
                    </button>

                    {availableCategories.map((category) => (
                        <button
                            key={category.categoryId}
                            onClick={() => setSelectedCategory(category.categoryId)}
                            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition ${
                                selectedCategory === category.categoryId
                                    ? "bg-orange-600 text-white"
                                    : "bg-white text-slate-600 hover:bg-orange-100"
                            }`}
                        >
                            {category.categoryName}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="h-80 animate-pulse rounded-[2rem] bg-white" />
                        ))}
                    </div>
                ) : filteredFoods.length === 0 ? (
                    <EmptyState
                        title="No foods found"
                        description="Try changing the category filter or search term."
                    />
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredFoods.map((food) => (
                            <div
                                key={food.foodId}
                                className="group overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100"
                            >
                                <div className="h-44 bg-gradient-to-br from-orange-100 to-yellow-100 p-6">
                                    <div className="grid h-full place-items-center rounded-[1.5rem] bg-white/60">
                                        <span className="text-6xl">🍽️</span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-950">
                                                {food.foodName}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {food.categoryName || "Food Item"}
                                            </p>
                                        </div>

                                        <StatusBadge status={food.status} />
                                    </div>

                                    <p className="min-h-[48px] text-sm leading-6 text-slate-500">
                                        {food.description || "Delicious food prepared with care."}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between">
                                        <p className="text-2xl font-black text-orange-600">
                                            LKR {food.price.toLocaleString()}
                                        </p>

                                        <Button
                                            disabled={actionLoading === food.foodId || food.status !== "AVAILABLE"}
                                            onClick={() => handleAddToCart(food)}
                                            className="!rounded-full !px-4"
                                        >
                                            <ShoppingCart size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default FoodsPage;