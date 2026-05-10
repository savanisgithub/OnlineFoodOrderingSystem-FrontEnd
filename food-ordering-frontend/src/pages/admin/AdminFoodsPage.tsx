import { type FormEvent, useEffect, useState } from "react";
import { AxiosError } from "axios";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import { categoryApi } from "../../api/categoryApi";
import { foodApi } from "../../api/foodApi";
import type { Category, FoodItem, FoodStatus } from "../../types";

function AdminFoodsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

    const [foodName, setFoodName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState<FoodStatus>("AVAILABLE");
    const [categoryId, setCategoryId] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);

            const [categoryData, foodData] = await Promise.all([
                categoryApi.getAll(),
                foodApi.getAll(),
            ]);

            setCategories(categoryData);
            setFoods(foodData);

            if (!categoryId && categoryData.length > 0) {
                setCategoryId(categoryData[0].categoryId);
            }
        } catch {
            setError("Failed to load foods or categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setEditingFood(null);
        setFoodName("");
        setDescription("");
        setPrice("");
        setStatus("AVAILABLE");

        if (categories.length > 0) {
            setCategoryId(categories[0].categoryId);
        }
    };

    const handleEdit = (food: FoodItem) => {
        setEditingFood(food);
        setFoodName(food.foodName);
        setDescription(food.description || "");
        setPrice(String(food.price));
        setStatus(food.status);
        setCategoryId(food.categoryId);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!foodName.trim()) {
            setError("Food name is required.");
            return;
        }

        if (!price || Number(price) <= 0) {
            setError("Valid price is required.");
            return;
        }

        if (!categoryId) {
            setError("Please select a category.");
            return;
        }

        const payload: Partial<FoodItem> = {
            foodName,
            description,
            price: Number(price),
            status,
            categoryId,
        };

        try {
            setSaving(true);

            if (editingFood) {
                await foodApi.update(editingFood.foodId, payload);
                setSuccess("Food item updated successfully.");
            } else {
                await foodApi.create(payload);
                setSuccess("Food item created successfully.");
            }

            resetForm();
            await fetchData();
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to save food item.");
        } finally {
            setSaving(false);
        }
    };

    const deleteFood = async (foodId: string) => {
        setError("");
        setSuccess("");

        const confirmed = window.confirm("Are you sure you want to delete this food item?");
        if (!confirmed) return;

        try {
            await foodApi.remove(foodId);
            setSuccess("Food item deleted successfully.");
            await fetchData();
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to delete food item.");
        }
    };

    return (
        <AdminLayout
            title="Food Management"
            subtitle="Create, update, delete, and control availability of food items."
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
                    {editingFood ? "Update Food Item" : "Create Food Item"}
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Input
                        label="Food Name"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        placeholder="Chicken Burger"
                    />

                    <Input
                        label="Price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="1200"
                    />

                    <Input
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Spicy chicken burger"
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Category
                        </label>

                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                        >
                            <option value="">Select category</option>
                            {categories.map((category) => (
                                <option key={category.categoryId} value={category.categoryId}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as FoodStatus)}
                            className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="OUT_OF_STOCK">Out of Stock</option>
                        </select>
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Button disabled={saving}>
                        {saving
                            ? "Saving..."
                            : editingFood
                              ? "Update Food"
                              : "Create Food"}
                    </Button>

                    {editingFood && (
                        <Button type="button" variant="secondary" onClick={resetForm}>
                            Cancel Edit
                        </Button>
                    )}
                </div>
            </form>

            <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">All Food Items</h2>

                {loading ? (
                    <div className="mt-5 h-52 animate-pulse rounded-3xl bg-orange-50" />
                ) : foods.length === 0 ? (
                    <div className="mt-5">
                        <EmptyState
                            title="No food items yet"
                            description="Create your first food item using the form above."
                        />
                    </div>
                ) : (
                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left">
                            <thead>
                                <tr className="border-b border-orange-100 text-sm text-slate-500">
                                    <th className="py-3">Food ID</th>
                                    <th className="py-3">Name</th>
                                    <th className="py-3">Category</th>
                                    <th className="py-3">Price</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {foods.map((food) => (
                                    <tr
                                        key={food.foodId}
                                        className="border-b border-orange-50 text-sm"
                                    >
                                        <td className="py-4 font-semibold text-slate-500">
                                            {food.foodId}
                                        </td>
                                        <td className="py-4">
                                            <p className="font-black text-slate-900">
                                                {food.foodName}
                                            </p>
                                            <p className="text-slate-500">
                                                {food.description || "-"}
                                            </p>
                                        </td>
                                        <td className="py-4 text-slate-600">
                                            {food.categoryName || food.categoryId}
                                        </td>
                                        <td className="py-4 font-black text-orange-600">
                                            LKR {food.price.toLocaleString()}
                                        </td>
                                        <td className="py-4">
                                            <StatusBadge status={food.status} />
                                        </td>
                                        <td className="py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="!px-4 !py-2"
                                                    onClick={() => handleEdit(food)}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    className="!px-4 !py-2"
                                                    onClick={() => deleteFood(food.foodId)}
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

export default AdminFoodsPage;