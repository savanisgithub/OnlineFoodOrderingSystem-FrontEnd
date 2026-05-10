import axiosInstance from "./axiosInstance";
import type { Category } from "../types";

export const categoryApi = {
    getAll: async () => {
        const res = await axiosInstance.get<Category[]>("/categories");
        return res.data;
    },

    create: async (data: Partial<Category>) => {
        await axiosInstance.post("/categories", data);
    },

    update: async (categoryId: string, data: Partial<Category>) => {
        await axiosInstance.patch(`/categories/${categoryId}`, data);
    },

    remove: async (categoryId: string) => {
        await axiosInstance.delete(`/categories/${categoryId}`);
    },
};