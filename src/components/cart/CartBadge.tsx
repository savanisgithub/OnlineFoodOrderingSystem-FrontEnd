interface CartBadgeProps {
    count: number;
}

export default function CartBadge({ count }: CartBadgeProps) {
    if (count === 0) return null;

    return (
        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {count > 99 ? "99+" : count}
        </div>
    );
}
