import axiosInstance from "./axiosInstance";
import type { Cart } from "../types";

export const cartApi = {
    getByUser: async (userId: string) => {
        const res = await axiosInstance.get<Cart>(`/carts/user/${userId}`);
        return res.data;
    },

    addItem: async (userId: string, foodId: string, quantity: number) => {
        await axiosInstance.post(`/carts/user/${userId}/items`, {
            foodId,
            quantity,
        });
    },

    updateItem: async (cartItemId: string, quantity: number) => {
        await axiosInstance.patch(`/carts/items/${cartItemId}`, {
            quantity,
        });
    },

    removeItem: async (cartItemId: string) => {
        await axiosInstance.delete(`/carts/items/${cartItemId}`);
    },

    clear: async (userId: string) => {
        await axiosInstance.delete(`/carts/user/${userId}/clear`);
    },
};