import { type FormEvent, useEffect, useState } from "react";
import { AxiosError } from "axios";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import EmptyState from "../../components/ui/EmptyState";

import type { UserRole } from "../../types/auth";
import { userApi, type UserDTO } from "../../api/usersApi";

function AdminUsersPage() {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [editingUser, setEditingUser] = useState<UserDTO | null>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>("CUSTOMER");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userApi.getAll();
            setUsers(data);
        } catch {
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const resetForm = () => {
        setEditingUser(null);
        setName("");
        setEmail("");
        setPassword("");
        setRole("CUSTOMER");
    };

    const handleEdit = (user: UserDTO) => {
        setEditingUser(user);
        setName(user.name);
        setEmail(user.email);
        setPassword("");
        setRole(user.role);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Name is required.");
            return;
        }

        if (!email.trim() || !email.includes("@")) {
            setError("Valid email is required.");
            return;
        }

        if (!editingUser && password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setSaving(true);

            if (editingUser) {
                await userApi.update(editingUser.userId, {
                    name,
                    email,
                    password: password || undefined,
                    role,
                });
                setSuccess("User updated successfully.");
            } else {
                await userApi.create({
                    name,
                    email,
                    password,
                    role,
                });
                setSuccess("User created successfully.");
            }

            resetForm();
            await fetchUsers();
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to save user.");
        } finally {
            setSaving(false);
        }
    };

    const deleteUser = async (userId: string) => {
        setError("");
        setSuccess("");

        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) return;

        try {
            await userApi.remove(userId);
            setSuccess("User deleted successfully.");
            await fetchUsers();
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to delete user.");
        }
    };

    return (
        <AdminLayout
            title="User Management"
            subtitle="Create, update, delete, and manage customer/admin accounts."
        >
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

            <form
                onSubmit={handleSubmit}
                className="mb-6 rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm"
            >
                <h2 className="text-xl font-black text-slate-950">
                    {editingUser ? "Update User" : "Create User"}
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Input
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Silva"
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@gmail.com"
                    />

                    <Input
                        label={editingUser ? "New Password (optional)" : "Password"}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={editingUser ? "Leave blank to keep existing" : "123456"}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Role</label>

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                            className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Button disabled={saving}>
                        {saving
                            ? "Saving..."
                            : editingUser
                              ? "Update User"
                              : "Create User"}
                    </Button>

                    {editingUser && (
                        <Button type="button" variant="secondary" onClick={resetForm}>
                            Cancel Edit
                        </Button>
                    )}
                </div>
            </form>

            <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">All Users</h2>

                {loading ? (
                    <div className="mt-5 h-52 animate-pulse rounded-3xl bg-orange-50" />
                ) : users.length === 0 ? (
                    <div className="mt-5">
                        <EmptyState
                            title="No users found"
                            description="Create a user account using the form above."
                        />
                    </div>
                ) : (
                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left">
                            <thead>
                                <tr className="border-b border-orange-100 text-sm text-slate-500">
                                    <th className="py-3">User ID</th>
                                    <th className="py-3">Name</th>
                                    <th className="py-3">Email</th>
                                    <th className="py-3">Role</th>
                                    <th className="py-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user.userId}
                                        className="border-b border-orange-50 text-sm"
                                    >
                                        <td className="py-4 font-semibold text-slate-500">
                                            {user.userId}
                                        </td>
                                        <td className="py-4 font-black text-slate-900">
                                            {user.name}
                                        </td>
                                        <td className="py-4 text-slate-600">{user.email}</td>
                                        <td className="py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-black ${
                                                    user.role === "ADMIN"
                                                        ? "bg-slate-900 text-white"
                                                        : "bg-orange-100 text-orange-700"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="!px-4 !py-2"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    className="!px-4 !py-2"
                                                    onClick={() => deleteUser(user.userId)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </AdminLayout>
    );
}

export default AdminUsersPage;