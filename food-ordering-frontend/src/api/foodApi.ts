import axiosInstance from "./axiosInstance";
import type { FoodItem } from "../types";

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

    create: async (data: Partial<FoodItem>) => {
        await axiosInstance.post("/foods", data);
    },

    update: async (foodId: string, data: Partial<FoodItem>) => {
        await axiosInstance.patch(`/foods/${foodId}`, data);
    },

    remove: async (foodId: string) => {
        await axiosInstance.delete(`/foods/${foodId}`);
    },
};