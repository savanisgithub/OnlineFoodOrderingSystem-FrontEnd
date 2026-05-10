import type { ReactNode } from "react";


interface EmptyStateProps {
    title: string;
    description: string;
    action?: ReactNode;
}

function EmptyState({ title, description, action }: EmptyStateProps) {
    return (
        <div className="rounded-[2rem] border border-orange-100 bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-black text-slate-900">{title}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {description}
            </p>

            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

export default EmptyState;