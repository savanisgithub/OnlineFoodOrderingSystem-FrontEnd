import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { paymentApi } from "../api/paymentApi";
import type { Payment } from "../types";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";

function PaymentPage() {
    const { orderId } = useParams();

    const [payment, setPayment] = useState<Payment | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("CARD");
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchPayment = async () => {
        if (!orderId) return;

        try {
            setPageLoading(true);
            const data = await paymentApi.getByOrder(orderId);
            setPayment(data);
        } catch {
            setPayment(null);
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchPayment();
    }, [orderId]);

    const createPayment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!orderId) return;

        try {
            setLoading(true);
            setError("");
            await paymentApi.create(orderId, paymentMethod);
            setSuccess("Payment record created successfully.");
            await fetchPayment();
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to create payment.");
        } finally {
            setLoading(false);
        }
    };

    const markCompleted = async () => {
        if (!payment) return;

        try {
            setLoading(true);
            await paymentApi.updateStatus(payment.paymentId, "COMPLETED");
            setSuccess("Payment completed successfully.");
            await fetchPayment();
        } catch {
            setError("Failed to update payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen px-4">
            <div className="mx-auto max-w-3xl">
                <div className="mb-4">
                    <h1 className="text-sm font-medium !text-slate-300">
                        Complete your payment
                    </h1>
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

                {pageLoading ? (
                    <div className="h-72 animate-pulse rounded-[2rem] bg-white" />
                ) : payment ? (
                    <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-xl font-black !text-slate-950">
                                    Payment #{payment.paymentId}
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Order ID: {payment.orderId}
                                </p>
                            </div>

                            <StatusBadge status={payment.status} />
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-orange-50 p-5">
                                <p className="text-sm text-slate-500">Amount</p>
                                <p className="mt-1 text-2xl font-black text-orange-600">
                                    LKR {payment.amount.toLocaleString()}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-orange-50 p-5">
                                <p className="text-sm text-slate-500">Method</p>
                                <p className="mt-1 text-xl font-black text-slate-900">
                                    {payment.paymentMethod}
                                </p>
                            </div>
                        </div>

                        {payment.status !== "COMPLETED" && (
                            <Button className="mt-6" disabled={loading} onClick={markCompleted}>
                                {loading ? "Updating..." : "Mark as Completed"}
                            </Button>
                        )}
                    </div>
                ) : (
                    <form
                        onSubmit={createPayment}
                        className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm"
                    >
                        <h2 className="text-xl font-black !text-slate-950">Create Payment</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            No payment record found for this order. Create one now.
                        </p>

                        <div className="mt-6">
                            <label className="text-sm font-semibold text-slate-700">
                                Payment Method
                            </label>

                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="mt-2 w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                            >
                                <option value="CARD">Card</option>
                                <option value="CASH">Cash</option>
                                <option value="ONLINE">Online</option>
                            </select>
                        </div>

                        <Button className="mt-6" disabled={loading}>
                            {loading ? "Creating..." : "Create Payment"}
                        </Button>
                    </form>
                )}
            </div>
        </main>
    );
}

export default PaymentPage;