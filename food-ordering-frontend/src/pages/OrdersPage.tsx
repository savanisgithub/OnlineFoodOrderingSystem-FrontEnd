import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { orderApi } from "../api/orderApi";
import { paymentApi } from "../api/paymentApi";
import type { Order, Payment } from "../types";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import StatusBadge from "../components/ui/StatusBadge";

function OrdersPage() {
    const { user, isAdmin } = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [payments, setPayments] = useState<{ [orderId: string]: Payment }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = isAdmin ? await orderApi.getAll() : await orderApi.getByUser(user.userId);
            setOrders(data);

            // Fetch payment info for each order
            const paymentsMap: { [orderId: string]: Payment } = {};
            for (const order of data) {
                try {
                    const payment = await paymentApi.getByOrder(order.orderId);
                    if (payment) {
                        paymentsMap[order.orderId] = payment;
                    }
                } catch {
                    // Order might not have payment yet, skip
                }
            }
            setPayments(paymentsMap);
        } catch {
            setError("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user, isAdmin]);

    const cancelOrder = async (orderId: string) => {
        try {
            await orderApi.cancel(orderId);
            await fetchOrders();
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to cancel order.");
        }
    };

    return (
        <main className="min-h-screen px-4">
            <div className="mx-auto max-w-4xl">
                <div className="mb-4">
                    <h1 className="text-sm font-medium !text-slate-500">
                        Track your food orders
                    </h1>
                </div>

                {error && (
                    <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="h-80 animate-pulse rounded-[2rem] bg-white" />
                ) : orders.length === 0 ? (
                    <EmptyState
                        title="No orders found"
                        description="Place an order from your cart to see it here."
                    />
                ) : (
                    <div className="space-y-5">
                        {orders.map((order) => (
                            <div
                                key={order.orderId}
                                className="rounded-[2rem] border border-orange-100 bg-white overflow-hidden shadow-sm"
                            >
                                {/* Header */}
                                <div className="border-b border-orange-100 bg-orange-50 px-6 py-3">
                                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-base font-black text-slate-950">
                                                    Order #{order.orderId.substring(0, 8)}
                                                </h3>
                                                <StatusBadge status={order.status} />
                                            </div>
                                            <p className="mt-2 text-xs text-slate-500 text-left">
                                                {new Date(order.orderDate).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-xs text-slate-500">Total Amount</p>
                                            <p className="text-xl font-black text-orange-600">
                                                LKR {order.totalAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="divide-y divide-orange-100 p-4">
                                    {order.orderItems?.map((item) => (
                                        <div
                                            key={item.orderItemId}
                                            className="flex gap-4 py-4 first:pt-0 last:pb-0"
                                        >
                                            {/* Item Image */}
                                            <div className="flex-shrink-0">
                                                <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-2xl border border-orange-100">
                                                    🍽️
                                                </div>
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1 min-w-0 text-left">
                                                <h4 className="font-bold text-slate-900">
                                                    {item.foodName}
                                                </h4>
                                                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                                    <span className="inline-flex items-center gap-1">
                                                        <span className="font-medium">Qty:</span>
                                                        <span className="font-bold text-slate-900">{item.quantity}</span>
                                                    </span>
                                                    <span className="text-slate-400">•</span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <span className="font-medium">LKR</span>
                                                        <span className="font-bold text-slate-900">{item.unitPrice.toLocaleString()}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Item Total */}
                                            <div className="flex-shrink-0 text-right">
                                                <p className="text-xs text-slate-500 mb-1">Item Total</p>
                                                <p className="text-lg font-black text-orange-600">
                                                    LKR {item.totalPrice.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer with Actions */}
                                <div className="border-t border-orange-100 bg-slate-50 px-6 py-4">
                                    {/* Payment Status (if exists) */}
                                    {payments[order.orderId] && (
                                        <div className="pb-2 border-b border-orange-100">
                                            <div className="flex items-">
                                                <p className="text-xs font-medium text-slate-600">Payment Status:</p>
                                                {payments[order.orderId].status === "COMPLETED" && (
                                                    <span className="text-sm font-bold px-3  text-green-700 flex items-top gap-2">
                                                        ✓ Paid
                                                    </span>
                                                )}
                                                {payments[order.orderId].status === "PENDING" && (
                                                    <span className="text-sm font-bold px-3 text-blue-700 flex items-center gap-2">
                                                        ⏳ Pending
                                                    </span>
                                                )}
                                                {payments[order.orderId].status === "FAILED" && (
                                                    <span className="text-sm font-bold px-3 py-1 bg-red-50 text-red-700 rounded-full flex items-center gap-2">
                                                        ✗ Failed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center">
                                        {order.status === "PLACED" && (
                                            <>
                                                {/* Show "Pay Now" only if payment is NOT completed */}
                                                {!payments[order.orderId] || payments[order.orderId].status !== "COMPLETED" ? (
                                                    <>
                                                        <Link to={`/payment/${order.orderId}`} className="flex-1 sm:flex-none">
                                                            <Button className="w-full sm:w-auto">
                                                                Pay Now
                                                            </Button>
                                                        </Link>

                                                        <Button 
                                                            variant="secondary" 
                                                            onClick={() => cancelOrder(order.orderId)}
                                                            className="w-full sm:w-auto"
                                                        >
                                                            Cancel Order
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <span className="text-sm font-semibold text-green-600 py-2 px-4 bg-green-50 rounded-lg">
                                                        ✓ Payment Complete - Preparing Order
                                                    </span>
                                                )}
                                            </>
                                        )}

                                        {order.status === "PREPARING" && (
                                            <span className="text-sm font-semibold text-blue-600 py-2 px-4 bg-blue-50 rounded-lg">
                                                🍳 Being Prepared
                                            </span>
                                        )}

                                        {order.status === "DELIVERED" && (
                                            <span className="text-sm font-semibold text-green-600 py-2 px-4 bg-green-50 rounded-lg">
                                                ✓ Order Completed
                                            </span>
                                        )}

                                        {order.status === "CANCELLED" && (
                                            <span className="text-sm font-semibold text-red-600 py-2 px-4 bg-red-50 rounded-lg">
                                                ✗ Order Cancelled
                                            </span>
                                        )}
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

export default OrdersPage;