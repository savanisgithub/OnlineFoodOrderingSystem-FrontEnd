import { useEffect, useState } from "react";
import { CreditCard, Filter, Clock, CheckCircle, XCircle } from "lucide-react";
import { paymentApi } from "../api/paymentApi";
import type { Payment, PaymentStatus } from "../types";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/ui/EmptyState";

function PaymentHistoryPage() {
    const { user } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState<PaymentStatus | "ALL">("ALL");

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await paymentApi.getAll();
            setPayments(data);
        } catch {
            setError("Failed to load payment history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [user]);

    const filteredPayments = filterStatus === "ALL" 
        ? payments 
        : payments.filter(p => p.status === filterStatus);

    const getStatusIcon = (status: PaymentStatus) => {
        switch (status) {
            case "COMPLETED":
                return <CheckCircle size={20} className="text-green-600" />;
            case "PENDING":
                return <Clock size={20} className="text-blue-600" />;
            case "FAILED":
                return <XCircle size={20} className="text-red-600" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-50 text-green-700 border-green-100";
            case "PENDING":
                return "bg-blue-50 text-blue-700 border-blue-100";
            case "FAILED":
                return "bg-red-50 text-red-700 border-red-100";
            default:
                return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    const getStatusLabel = (status: PaymentStatus) => {
        switch (status) {
            case "COMPLETED":
                return "Completed";
            case "PENDING":
                return "Pending";
            case "FAILED":
                return "Failed";
            default:
                return status;
        }
    };

    const totalAmount = filteredPayments
        .filter(p => p.status === "COMPLETED")
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <main className="min-h-screen px-4">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-sm font-medium !text-slate-500">
                        Payments & Transactions
                    </h1>
                </div>

                {error && (
                    <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-24 animate-pulse rounded-[2rem] bg-white" />
                        ))}
                    </div>
                ) : payments.length === 0 ? (
                    <EmptyState
                        title="No payments yet"
                        description="Your payment history will appear here."
                    />
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="mb-8 grid gap-4 md:grid-cols-3">
                            {/* Total Transactions */}
                            <div className="rounded-[1.5rem] border border-orange-100 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="rounded-lg bg-orange-50 p-2">
                                        <CreditCard size={20} className="text-orange-600" />
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">Total Transactions</p>
                                </div>
                                <p className="text-2xl font-black text-slate-900">{payments.length}</p>
                            </div>

                            {/* Total Paid */}
                            <div className="rounded-[1.5rem] border border-green-100 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="rounded-lg bg-green-50 p-2">
                                        <CheckCircle size={20} className="text-green-600" />
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">Total Paid</p>
                                </div>
                                <p className="text-2xl font-black text-slate-900">
                                    LKR {totalAmount.toLocaleString()}
                                </p>
                            </div>

                            {/* Pending Payments */}
                            <div className="rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="rounded-lg bg-blue-50 p-2">
                                        <Clock size={20} className="text-blue-600" />
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">Pending Payments</p>
                                </div>
                                <p className="text-2xl font-black text-slate-900">
                                    {payments.filter(p => p.status === "PENDING").length}
                                </p>
                            </div>
                        </div>

                        {/* Filter Section */}
                        <div className="mb-6 flex flex-wrap gap-2 items-center">
                            <Filter size={16} className="text-slate-500" />
                            <span className="text-sm text-slate-600 font-medium">Filter:</span>
                            
                            <div className="flex flex-wrap gap-2">
                                {(["ALL", "COMPLETED", "PENDING", "FAILED"] as const).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                                            filterStatus === status
                                                ? "bg-orange-600 text-white shadow-md"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                    >
                                        {status === "ALL" ? "All" : getStatusLabel(status as PaymentStatus)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payments List */}
                        <div className="space-y-4">
                            {filteredPayments.length === 0 ? (
                                <div className="rounded-[2rem] border border-orange-100 bg-white p-8 text-center">
                                    <p className="text-slate-500">No payments found with this status.</p>
                                </div>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <div
                                        key={payment.paymentId}
                                        className="rounded-[1.5rem] border border-orange-100 bg-white p-4 shadow-sm hover:shadow-md transition"
                                    >
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            {/* Left: Payment Info */}
                                            <div className="flex items-start gap-4">
                                                <div className="rounded-lg bg-orange-50 p-3">
                                                    <CreditCard size={24} className="text-orange-600" />
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-base font-bold text-slate-900">
                                                        Payment #{payment.paymentId.substring(0, 8)}
                                                    </h3>
                                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                                        <span>
                                                            <span className="font-medium text-slate-700">Order:</span> #{payment.orderId.substring(0, 8)}
                                                        </span>
                                                        <span className="text-slate-400">•</span>
                                                        <span>
                                                            <span className="font-medium text-slate-700">Method:</span> {payment.paymentMethod}
                                                        </span>
                                                        <span className="text-slate-400">•</span>
                                                        <span>
                                                            {new Date(payment.paymentDate).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Amount & Status */}
                                            <div className="flex items-end justify-between gap-4 md:flex-col md:items-end md:gap-2">
                                                <div className="text-left md:text-right">
                                                    <p className="text-xs text-slate-500 mb-1">Amount</p>
                                                    <p className="text-2xl font-black text-orange-600">
                                                        LKR {payment.amount.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${getStatusColor(payment.status)}`}>
                                                    {getStatusIcon(payment.status)}
                                                    <span className="text-sm font-bold">
                                                        {getStatusLabel(payment.status)}
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
