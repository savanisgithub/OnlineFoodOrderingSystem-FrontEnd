import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, CreditCard, Filter, XCircle } from "lucide-react";
import { orderApi } from "../api/orderApi";
import { paymentApi } from "../api/paymentApi";
import type { Order, Payment, PaymentStatus } from "../types";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

type PaymentRecord = Payment & {
    order?: Order;
};

function PaymentHistoryPage() {
    const { user, isAdmin } = useAuth();

    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState<PaymentStatus | "ALL">("ALL");

    const fetchPayments = async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError("");

            if (isAdmin) {
                const allPayments = await paymentApi.getAll();
                setPayments(allPayments);
                return;
            }

            const myOrders = await orderApi.getByUser(user.userId);

            const paymentResults = await Promise.allSettled(
                myOrders.map(async (order) => {
                    const payment = await paymentApi.getByOrder(order.orderId);

                    return {
                        ...payment,
                        order,
                    };
                })
            );

            const myPayments: PaymentRecord[] = paymentResults.flatMap((result) =>
                result.status === "fulfilled" ? [result.value] : []
            );

            setPayments(myPayments);
        } catch {
            setError("Failed to load payment history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [user, isAdmin]);

    const filteredPayments = useMemo(() => {
        if (filterStatus === "ALL") return payments;
        return payments.filter((payment) => payment.status === filterStatus);
    }, [payments, filterStatus]);

    const totalPaid = payments
        .filter((payment) => payment.status === "COMPLETED")
        .reduce((sum, payment) => sum + payment.amount, 0);

    const pendingCount = payments.filter(
        (payment) => payment.status === "PENDING"
    ).length;

    const getStatusIcon = (status: PaymentStatus) => {
        if (status === "COMPLETED") {
            return <CheckCircle size={20} className="text-green-600" />;
        }

        if (status === "PENDING") {
            return <Clock size={20} className="text-blue-600" />;
        }

        return <XCircle size={20} className="text-red-600" />;
    };

    const getStatusStyle = (status: PaymentStatus) => {
        const styles: Record<PaymentStatus, string> = {
            COMPLETED: "bg-green-50 text-green-700 border-green-100",
            PENDING: "bg-blue-50 text-blue-700 border-blue-100",
            FAILED: "bg-red-50 text-red-700 border-red-100",
        };

        return styles[status];
    };

    return (
        <main className="min-h-screen px-4">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-sm font-medium !text-slate-500">
                        {isAdmin ? "All Payments & Transactions" : "My Payments & Transactions"}
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        {isAdmin
                            ? "View all payment records created in the food ordering system."
                            : "View payment records linked only to your orders."}
                    </p>
                </div>

                {error && (
                    <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-24 animate-pulse rounded-[2rem] bg-white"
                            />
                        ))}
                    </div>
                ) : payments.length === 0 ? (
                    <EmptyState
                        title="No payments yet"
                        description={
                            isAdmin
                                ? "No payment records have been created yet."
                                : "Payments will appear here after you create a payment for an order."
                        }
                        action={
                            !isAdmin && (
                                <Link to="/orders">
                                    <Button>View Orders</Button>
                                </Link>
                            )
                        }
                    />
                ) : (
                    <>
                        <div className="mb-8 grid gap-4 md:grid-cols-3">
                            <div className="rounded-[1.5rem] border border-orange-100 bg-white p-4 shadow-sm">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="rounded-lg bg-orange-50 p-2">
                                        <CreditCard size={20} className="text-orange-600" />
                                    </div>
                                    <p className="text-xs font-medium text-slate-500">
                                        {isAdmin ? "Total Transactions" : "My Transactions"}
                                    </p>
                                </div>

                                <p className="text-2xl font-black text-slate-900">
                                    {payments.length}
                                </p>
                            </div>

                            <div className="rounded-[1.5rem] border border-green-100 bg-white p-4 shadow-sm">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="rounded-lg bg-green-50 p-2">
                                        <CheckCircle size={20} className="text-green-600" />
                                    </div>

                                    <p className="text-xs font-medium text-slate-500">
                                        Total Paid
                                    </p>
                                </div>

                                <p className="text-2xl font-black text-slate-900">
                                    LKR {totalPaid.toLocaleString()}
                                </p>
                            </div>

                            <div className="rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-50 p-2">
                                        <Clock size={20} className="text-blue-600" />
                                    </div>

                                    <p className="text-xs font-medium text-slate-500">
                                        Pending Payments
                                    </p>
                                </div>

                                <p className="text-2xl font-black text-slate-900">
                                    {pendingCount}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 flex flex-wrap items-center gap-2">
                            <Filter size={16} className="text-slate-500" />
                            <span className="text-sm font-medium text-slate-600">
                                Filter:
                            </span>

                            {(["ALL", "COMPLETED", "PENDING", "FAILED"] as const).map(
                                (status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                                            filterStatus === status
                                                ? "bg-orange-600 text-white shadow-md"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                    >
                                        {status === "ALL" ? "All" : status}
                                    </button>
                                )
                            )}
                        </div>

                        <div className="space-y-4">
                            {filteredPayments.length === 0 ? (
                                <div className="rounded-[2rem] border border-orange-100 bg-white p-8 text-center">
                                    <p className="text-slate-500">
                                        No payments found with this status.
                                    </p>
                                </div>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <div
                                        key={payment.paymentId}
                                        className="rounded-[1.5rem] border border-orange-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="rounded-lg bg-orange-50 p-3">
                                                    <CreditCard
                                                        size={24}
                                                        className="text-orange-600"
                                                    />
                                                </div>

                                                <div>
                                                    <h3 className="text-base font-bold text-slate-900">
                                                        Payment #{payment.paymentId.substring(0, 8)}
                                                    </h3>

                                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                                        <span>
                                                            <b>Order:</b> #{payment.orderId.substring(0, 8)}
                                                        </span>

                                                        <span className="text-slate-400">•</span>

                                                        <span>
                                                            <b>Method:</b> {payment.paymentMethod}
                                                        </span>

                                                        {isAdmin && payment.order?.userName && (
                                                            <>
                                                                <span className="text-slate-400">•</span>
                                                                <span>
                                                                    <b>Customer:</b> {payment.order.userName}
                                                                </span>
                                                            </>
                                                        )}

                                                        {payment.paymentDate && (
                                                            <>
                                                                <span className="text-slate-400">•</span>
                                                                <span>
                                                                    {new Date(payment.paymentDate).toLocaleString()}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between gap-4 md:flex-col md:items-end">
                                                <div className="text-left md:text-right">
                                                    <p className="mb-1 text-xs text-slate-500">
                                                        Amount
                                                    </p>

                                                    <p className="text-2xl font-black text-orange-600">
                                                        LKR {payment.amount.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div
                                                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${getStatusStyle(
                                                        payment.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(payment.status)}

                                                    <span className="text-sm font-bold">
                                                        {payment.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default PaymentHistoryPage;
