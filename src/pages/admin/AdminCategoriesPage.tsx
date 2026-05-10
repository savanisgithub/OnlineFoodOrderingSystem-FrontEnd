import { type FormEvent, useEffect, useState } from "react";
import { AxiosError } from "axios";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import EmptyState from "../../components/ui/EmptyState";
import { categoryApi } from "../../api/categoryApi";
import type { Category } from "../../types";

function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryApi.getAll();
            setCategories(data);
        } catch {
            setError("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setEditingCategory(null);
        setCategoryName("");
        setDescription("");
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setCategoryName(category.categoryName);
        setDescription(category.description || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!categoryName.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            setSaving(true);

            if (editingCategory) {
                await categoryApi.update(editingCategory.categoryId, {
                    categoryName,
                    description,
                });
                setSuccess("Category updated successfully.");
            } else {
                await categoryApi.create({
                    categoryName,
                    description,
                });
                setSuccess("Category created successfully.");
            }

            resetForm();
            await fetchCategories();
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to save category.");
        } finally {
            setSaving(false);
        }
    };

    const deleteCategory = async (categoryId: string) => {
        setError("");
        setSuccess("");

        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (!confirmed) return;

        try {
            await categoryApi.remove(categoryId);
            setSuccess("Category deleted successfully.");
            await fetchCategories();
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to delete category.");
        }
    };

    return (
        <AdminLayout
            title="Category Management"
            subtitle="Create, update, and delete food categories used by your menu."
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
                    {editingCategory ? "Update Category" : "Create Category"}
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Input
                        label="Category Name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Burgers"
                    />

                    <Input
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Burger items"
                    />
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Button disabled={saving}>
                        {saving
                            ? "Saving..."
                            : editingCategory
                              ? "Update Category"
                              : "Create Category"}
                    </Button>

                    {editingCategory && (
                        <Button type="button" variant="secondary" onClick={resetForm}>
                            Cancel Edit
                        </Button>
                    )}
                </div>
            </form>

            <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">All Categories</h2>

                {loading ? (
                    <div className="mt-5 h-52 animate-pulse rounded-3xl bg-orange-50" />
                ) : categories.length === 0 ? (
                    <div className="mt-5">
                        <EmptyState
                            title="No categories yet"
                            description="Create your first category using the form above."
                        />
                    </div>
                ) : (
                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left">
                            <thead>
                                <tr className="border-b border-orange-100 text-sm text-slate-500">
                                    <th className="py-3">Category ID</th>
                                    <th className="py-3">Name</th>
                                    <th className="py-3">Description</th>
                                    <th className="py-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {categories.map((category) => (
                                    <tr
                                        key={category.categoryId}
                                        className="border-b border-orange-50 text-sm"
                                    >
                                        <td className="py-4 font-semibold text-slate-500">
                                            {category.categoryId}
                                        </td>
                                        <td className="py-4 font-black text-slate-900">
                                            {category.categoryName}
                                        </td>
                                        <td className="py-4 text-slate-500">
                                            {category.description || "-"}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="!px-4 !py-2"
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    className="!px-4 !py-2"
                                                    onClick={() => deleteCategory(category.categoryId)}
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

export default AdminCategoriesPage;