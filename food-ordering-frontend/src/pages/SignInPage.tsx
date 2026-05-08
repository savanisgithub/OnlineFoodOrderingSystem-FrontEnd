import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

function SignInPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!email.trim()) return "Email is required";
        if (!email.includes("@")) return "Please enter a valid email";
        if (!password.trim()) return "Password is required";
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
            await login({ email, password });
            navigate("/foods");
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setFormError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to continue ordering your favorite food."
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {formError && (
                    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {formError}
                    </div>
                )}

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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button fullWidth type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                </Button>

                <p className="text-center text-sm text-slate-500">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="font-bold text-orange-600 hover:text-orange-700">
                        Create one
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}

export default SignInPage;