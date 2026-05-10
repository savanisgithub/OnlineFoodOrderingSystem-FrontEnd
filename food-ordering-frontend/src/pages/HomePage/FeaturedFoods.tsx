import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { AxiosError } from "axios";
import { foodApi } from "../../api/foodApi";
import { cartApi } from "../../api/cartApi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import type { FoodItem } from "../../types";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";
import { getBackendImageUrl } from "../../utils/imageUrl";

function FeaturedFoods() {
    const { user, isAuthenticated, isAdmin } = useAuth();
    const { refreshCartCount } = useCart();

    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const data = await foodApi.getAll();
            setFoods(data.slice(0, 4));
        } catch {
            setError("Unable to load featured foods.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleAddToCart = async (food: FoodItem) => {
        setError("");
        setMessage("");

        if (!isAuthenticated || !user) {
            setError("Please sign in before adding items to your cart.");
            return;
        }

        if (isAdmin) {
            setError("Admin users cannot add items to cart.");
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
            setMessage(`${food.foodName} added to cart.`);
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to add item to cart.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <section className="bg-orange-50/40 px-4 py-5 md:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-2xl font-bold text-orange-600 text-left">Featured Foods</p>
                        <p className="mt-3 max-w-2xl text-slate-900">
                            Freshly prepared items customers love ordering again and again.
                        </p>
                    </div>

                    <Link
                        to="/foods"
                        className="w-fit rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-100"
                    >
                        Browse All Foods
                    </Link>
                </div>

                {error && (
                    <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-5 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
                        {message}
                    </div>
                )}

                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-80 animate-pulse rounded-[2rem] bg-white"
                            />
                        ))}
                    </div>
                ) : foods.length === 0 ? (
                    <div className="rounded-[2rem] border border-orange-100 bg-white p-10 text-center">
                        <h3 className="text-xl font-black text-slate-950">
                            No featured foods yet
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Foods added by admin will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {foods.map((food) => (
                            <div
                                key={food.foodId}
                                className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100"
                            >
                                <div className="h-44 bg-gradient-to-br from-orange-100 to-yellow-100">
                                    {food.imageUrl ? (
                                        <img
                                            src={getBackendImageUrl(food.imageUrl)}
                                            alt={food.foodName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="grid h-full place-items-center text-6xl">
                                            🍽️
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-950">
                                                {food.foodName}
                                            </h3>
                                        </div>

                                        <StatusBadge status={food.status} />
                                    </div>

                                    <p className="min-h-[40px] text-sm leading-6 text-slate-500">
                                        {food.description || "Delicious food prepared with care."}
                                    </p>

                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="text-xl font-black text-orange-600">
                                            LKR {food.price.toLocaleString()}
                                        </p>

                                        <Button
                                            disabled={
                                                actionLoading === food.foodId ||
                                                food.status !== "AVAILABLE" ||
                                                isAdmin
                                            }
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
        </section>
    );
}

export default FeaturedFoods;