import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { AxiosError } from "axios";
import { cartApi } from "../api/cartApi";
import { orderApi } from "../api/orderApi";
import type { Cart } from "../types";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

function CartPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCart = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = await cartApi.getByUser(user.userId);
            setCart(data);
        } catch {
            setError("Failed to load cart.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const updateQuantity = async (cartItemId: string, quantity: number) => {
        if (quantity <= 0) return;

        try {
            await cartApi.updateItem(cartItemId, quantity);
            await fetchCart();
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to update cart item.");
        }
    };

    const removeItem = async (cartItemId: string) => {
        try {
            await cartApi.removeItem(cartItemId);
            await fetchCart();
        } catch {
            setError("Failed to remove cart item.");
        }
    };

    const clearCart = async () => {
        if (!user) return;

        try {
            await cartApi.clear(user.userId);
            await fetchCart();
        } catch {
            setError("Failed to clear cart.");
        }
    };

    const placeOrder = async () => {
        if (!user) return;

        try {
            setActionLoading(true);
            await orderApi.placeOrder(user.userId);
            navigate("/orders");
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to place order.");
        } finally {
            setActionLoading(false);
        }
    };

    const cartItems = cart?.cartItems || [];


    return (
        <main className="min-h-screen px-4">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-sm font-medium !text-slate-500">
                        Review your selected meals
                    </h1>
                </div>

                {error && (
                    <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="h-80 animate-pulse rounded-[2rem] bg-white" />
                ) : cartItems.length === 0 ? (
                    <EmptyState
                        title="Your cart is empty"
                        description="Browse the food menu and add your favorite meals."
                        action={
                            <Link to="/foods">
                                <Button>Browse Foods</Button>
                            </Link>
                        }
                    />
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.cartItemId}
                                    className="flex flex-col gap-4 rounded-[2rem] border border-orange-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-orange-100 text-4xl">
                                            🍽️
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-black text-slate-950">
                                                {item.foodName}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                LKR {item.unitPrice.toLocaleString()} each
                                            </p>
                                            <p className="mt-1 text-sm font-bold text-orange-600">
                                                Total: LKR {item.totalPrice.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center rounded-full border border-orange-100 bg-orange-50 p-1">
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-700"
                                            >
                                                <Minus size={16} />
                                            </button>

                                            <span className="w-10 text-center font-black">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                className="grid h-9 w-9 place-items-center rounded-full bg-orange-600 text-white"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.cartItemId)}
                                            className="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <aside className="h-fit rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
                            <h2 className="text-xl !font-bold !text-slate-950">Order Summary</h2>

                            <div className="mt-6 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Items</span>
                                    <span className="font-bold">{cartItems.length}</span>
                                </div>

                                <div className="flex justify-between border-t border-orange-100 pt-4">
                                    <span className="text-slate-500">Total</span>
                                    <span className="text-2xl font-black text-orange-600">
                                        LKR {cart?.totalAmount?.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Button
                                fullWidth
                                className="mt-6"
                                disabled={actionLoading}
                                onClick={placeOrder}
                            >
                                {actionLoading ? "Placing order..." : "Place Order"}
                            </Button>

                            <Button
                                fullWidth
                                variant="secondary"
                                className="mt-3"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </Button>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}

export default CartPage;