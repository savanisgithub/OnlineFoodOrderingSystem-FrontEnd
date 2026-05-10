import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>

      <input
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 ${
          error ? "border-red-400" : "border-orange-100"
        } ${className}`}
        {...props}
      />

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}