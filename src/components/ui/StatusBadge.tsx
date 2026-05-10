interface StatusBadgeProps {
    status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
    const styles: Record<string, string> = {
        AVAILABLE: "bg-green-50 text-green-700 border-green-100",
        OUT_OF_STOCK: "bg-red-50 text-red-700 border-red-100",
        PLACED: "bg-blue-50 text-blue-700 border-blue-100",
        PREPARING: "bg-yellow-50 text-yellow-700 border-yellow-100",
        DELIVERED: "bg-green-50 text-green-700 border-green-100",
        CANCELLED: "bg-red-50 text-red-700 border-red-100",
        PENDING: "bg-yellow-50 text-yellow-700 border-yellow-100",
        COMPLETED: "bg-green-50 text-green-700 border-green-100",
        FAILED: "bg-red-50 text-red-700 border-red-100",
    };

    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                styles[status] || "bg-slate-50 text-slate-600 border-slate-100"
            }`}
        >
            {status.replaceAll("_", " ")}
        </span>
    );
}

export default StatusBadge;