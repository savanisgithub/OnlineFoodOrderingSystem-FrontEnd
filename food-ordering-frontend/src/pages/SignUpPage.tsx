import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types/auth";

function SignUpPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>("CUSTOMER");
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!name.trim()) return "Name is required";
        if (!email.trim()) return "Email is required";
        if (!email.includes("@")) return "Please enter a valid email";
        if (!password.trim()) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
        return "";
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError("");

        const error = validate();
        if (error) {
            setFormError(error);
            return;
        }

        try {
            setLoading(true);
            await register({ name, email, password, role });
            navigate("/signin");
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setFormError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Join FoodieHub and start ordering delicious meals."
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {formError && (
                    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {formError}
                    </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="John Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Account Type
                        </label>

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                            className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                </div>

                <Button fullWidth type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </Button>

                <p className="text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link to="/signin" className="font-bold text-orange-600 hover:text-orange-700">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}

export default SignUpPage;