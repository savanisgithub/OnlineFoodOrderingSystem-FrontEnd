import {  useEffect, useState, type FormEvent } from "react";
import { AxiosError } from "axios";
import { categoryApi } from "../api/categoryApi";
import { foodApi } from "../api/foodApi";
import type { Category, FoodItem, FoodStatus } from "../types";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import StatusBadge from "../components/ui/StatusBadge";

function AdminDashboardPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [foods, setFoods] = useState<FoodItem[]>([]);

    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");

    const [foodName, setFoodName] = useState("");
    const [foodDescription, setFoodDescription] = useState("");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState<FoodStatus>("AVAILABLE");
    const [categoryId, setCategoryId] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        const [categoryData, foodData] = await Promise.all([
            categoryApi.getAll(),
            foodApi.getAll(),
        ]);

        setCategories(categoryData);
        setFoods(foodData);

        if (!categoryId && categoryData.length > 0) {
            setCategoryId(categoryData[0].categoryId);
        }
    };

    useEffect(() => {
        fetchData().catch(() => setError("Failed to load admin data."));
    }, []);

    const resetMessages = () => {
        setError("");
        setSuccess("");
    };

    const createCategory = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        resetMessages();

        if (!categoryName.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            setLoading(true);
            await categoryApi.create({
                categoryName,
                description: categoryDescription,
            });

            setCategoryName("");
            setCategoryDescription("");
            setSuccess("Category created successfully.");
            await fetchData();
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to create category.");
        } finally {
            setLoading(false);
        }
    };

    const createFood = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        resetMessages();

        if (!foodName.trim()) {
            setError("Food name is required.");
            return;
        }

        if (!price || Number(price) <= 0) {
            setError("Valid price is required.");
            return;
        }

        if (!categoryId) {
            setError("Please create/select a category first.");
            return;
        }

        try {
            setLoading(true);
            await foodApi.create({
                foodName,
                description: foodDescription,
                price: Number(price),
                status,
                categoryId,
            });

            setFoodName("");
            setFoodDescription("");
            setPrice("");
            setStatus("AVAILABLE");
            setSuccess("Food item created successfully.");
            await fetchData();
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to create food.");
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            resetMessages();
            await categoryApi.remove(id);
            setSuccess("Category deleted successfully.");
            await fetchData();
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to delete category.");
        }
    };

    const deleteFood = async (id: string) => {
        try {
            resetMessages();
            await foodApi.remove(id);
            setSuccess("Food item deleted successfully.");
            await fetchData();
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to delete food item.");
        }
    };

    return (
        <main className="min-h-screen px-4 ">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="mt-2 text-4xl font-black text-slate-950">
                        Manage food ordering system
                    </h1>
                    <p className="mt-3 text-slate-500">
                        Create categories, manage food items, and keep the menu updated.
                    </p>
                </div>

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

                <div className="grid gap-6 lg:grid-cols-2">
                    <form
                        onSubmit={createCategory}
                        className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm"
                    >
                        <h2 className="text-xl font-black text-slate-950">Create Category</h2>

                        <div className="mt-5 space-y-4">
                            <Input
                                label="Category Name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Burgers"
                            />

                            <Input
                                label="Description"
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                                placeholder="Burger items"
                            />

                            <Button disabled={loading}>Create Category</Button>
                        </div>
                    </form>

                    <form
                        onSubmit={createFood}
                        className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm"
                    >
                        <h2 className="text-xl font-black text-slate-950">Create Food Item</h2>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
                                value={foodDescription}
                                onChange={(e) => setFoodDescription(e.target.value)}
                                placeholder="Spicy chicken burger"
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Category</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                >
                                    {categories.map((category) => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Status</label>
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

                        <Button disabled={loading} className="mt-5">
                            Create Food
                        </Button>
                    </form>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-black text-slate-950">Categories</h2>

                        <div className="mt-5 space-y-3">
                            {categories.map((category) => (
                                <div
                                    key={category.categoryId}
                                    className="flex items-center justify-between rounded-2xl bg-orange-50 px-4 py-3"
                                >
                                    <div>
                                        <p className="font-bold text-slate-900">{category.categoryName}</p>
                                        <p className="text-sm text-slate-500">{category.description}</p>
                                    </div>

                                    <Button
                                        variant="danger"
                                        className="!px-4 !py-2"
                                        onClick={() => deleteCategory(category.categoryId)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-black text-slate-950">Food Items</h2>

                        <div className="mt-5 space-y-3">
                            {foods.map((food) => (
                                <div
                                    key={food.foodId}
                                    className="rounded-2xl bg-orange-50 px-4 py-3"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-bold text-slate-900">{food.foodName}</p>
                                            <p className="text-sm text-slate-500">
                                                {food.categoryName} • LKR {food.price.toLocaleString()}
                                            </p>
                                        </div>

                                        <StatusBadge status={food.status} />
                                    </div>

                                    <div className="mt-3 flex justify-end">
                                        <Button
                                            variant="danger"
                                            className="!px-4 !py-2"
                                            onClick={() => deleteFood(food.foodId)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default AdminDashboardPage;