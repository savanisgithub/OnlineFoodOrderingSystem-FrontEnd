import { useEffect, useState, useRef, useCallback } from "react";
import { ShoppingCart as CartIcon, Trash2 } from "lucide-react";
import { AxiosError } from "axios";
import { cartApi } from "../../api/cartApi";
import type { CartItem } from "../../types";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import FoodImage from "../ui/FoodImage";

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onCartUpdate?: () => void;
}

export default function CartModal({ isOpen, onClose, userId, onCartUpdate }: CartModalProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const modalRef = useRef<HTMLDivElement>(null);

    // Memoize fetchCart to prevent dependency loop
    const fetchCart = useCallback(async () => {
        if (!userId) return;
        
        try {
            setLoading(true);
            setError("");
            const cart = await cartApi.getByUser(userId);
            setCartItems(cart.cartItems || []);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(axiosErr.response?.data?.message || "Failed to load cart");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Fetch cart only when modal opens
    useEffect(() => {
        if (isOpen && userId) {
            fetchCart();
        }
    }, [isOpen, userId]);

    // Click outside handler
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    const handleRemoveItem = async (cartItemId: string) => {
        try {
            await cartApi.removeItem(cartItemId);
            setCartItems(cartItems.filter((item) => item.cartItemId !== cartItemId));
            onCartUpdate?.();
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(axiosErr.response?.data?.message || "Failed to remove item");
        }
    };

    const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
        if (quantity < 1) {
            handleRemoveItem(cartItemId);
            return;
        }

        try {
            await cartApi.updateItem(cartItemId, quantity);
            setCartItems(
                cartItems.map((item) =>
                    item.cartItemId === cartItemId ? { ...item, quantity } : item
                )
            );
            onCartUpdate?.();
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(axiosErr.response?.data?.message || "Failed to update item");
        }
    };

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + (item.food?.price || item.unitPrice || 0) * item.quantity,
        0
    );

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[90]"
                onClick={onClose}
            />

            {/* Dropdown Modal */}
            <div
                ref={modalRef}
                className="fixed top-16 right-4 md:right-8 w-100 max-h-[calc(100vh-200px)] bg-white rounded-3xl shadow-2xl flex flex-col z-[100] border border-slate-100"
            >
                {/* Pointer Arrow */}
                <div className="absolute -top-2 right-12 md:right-16">
                    <div className="w-4 h-4 bg-white border-l border-t border-slate-100 transform rotate-45" />
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 border-b border-orange-100 p-2 md:p-3">
                    <CartIcon className="text-orange-600" size={24} />
                    <h2 className="text-lg !font-bold !text-slate-800">Shopping Cart</h2>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto max-h-[calc(100vh-350px)]">
                    {error && (
                        <div className="m-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="space-y-4 p-4 md:p-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-20 animate-pulse rounded-xl bg-slate-100"
                                />
                            ))}
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                            <CartIcon size={48} className="mb-3 text-slate-300" />
                            <p className="text-center text-sm text-slate-500">
                                Your cart is empty
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 p-4 md:p-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.cartItemId}
                                    className="flex gap-3 rounded-2xl border border-orange-100 p-3 bg-orange-50"
                                >
                                    <FoodImage
                                        imageUrl={item.imageUrl || item.food?.imageUrl}
                                        alt={item.food?.foodName || item.foodName}
                                        className="h-20 w-20 flex-shrink-0 rounded-lg border border-orange-100"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 text-sm truncate">
                                            {item.food?.foodName || item.foodName}
                                        </h3>
                                        <p className="text-xs text-slate-600">
                                            Rs. {(item.food?.price || item.unitPrice).toLocaleString()}
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 rounded-full border border-orange-200 mt-2 w-fit bg-white">
                                            <button
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        item.cartItemId,
                                                        item.quantity - 1
                                                    )
                                                }
                                                className="px-2 py-0.5 hover:bg-orange-50 text-sm"
                                            >
                                                −
                                            </button>
                                            <span className="w-6 text-center text-xs font-bold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        item.cartItemId,
                                                        item.quantity + 1
                                                    )
                                                }
                                                className="px-2 py-0.5 hover:bg-orange-50 text-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => handleRemoveItem(item.cartItemId)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <p className="text-sm font-bold text-orange-600">
                                            Rs. {(
                                                (item.food?.price || item.unitPrice) * item.quantity
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-orange-100  p-3 md:p-3 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-700 text-sm">Total:</span>
                            <span className="text-xl font-black text-orange-600">
                                Rs. {totalPrice.toLocaleString()}
                            </span>
                        </div>

                        <Button
                            onClick={() => {
                                onClose();
                                navigate("/cart");
                            }}
                            className="w-full"
                        >
                            VIEW CART
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
