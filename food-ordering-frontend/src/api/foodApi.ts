import axiosInstance from "./axiosInstance";
import type { FoodItem, FoodStatus } from "../types";

export interface FoodMutationData {
    foodName: string;
    description?: string;
    price: number;
    status: FoodStatus;
    categoryId: string;
    image?: File | null;
}

const toFoodFormData = ({ image, ...food }: FoodMutationData) => {
    const formData = new FormData();
    formData.append("food", new Blob([JSON.stringify(food)], { type: "application/json" }));

    if (image) {
        formData.append("image", image);
    }

    return formData;
};

export const foodApi = {
    getAll: async () => {
        const res = await axiosInstance.get<FoodItem[]>("/foods");
        return res.data;
    },

    getAvailable: async () => {
        const res = await axiosInstance.get<FoodItem[]>("/foods/available");
        return res.data;
    },

    getByCategory: async (categoryId: string) => {
        const res = await axiosInstance.get<FoodItem[]>(`/foods/category/${categoryId}`);
        return res.data;
    },

    create: async (data: FoodMutationData) => {
        await axiosInstance.post("/foods", toFoodFormData(data), {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    update: async (foodId: string, data: FoodMutationData) => {
        await axiosInstance.patch(`/foods/${foodId}`, toFoodFormData(data), {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    remove: async (foodId: string) => {
        await axiosInstance.delete(`/foods/${foodId}`);
    },
};
