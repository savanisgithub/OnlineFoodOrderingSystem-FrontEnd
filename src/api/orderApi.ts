import axiosInstance from "./axiosInstance";
import type { Order, OrderStatus } from "../types";

export const orderApi = {
    placeOrder: async (userId: string) => {
        await axiosInstance.post(`/orders/user/${userId}/place`);
    },

    getByUser: async (userId: string) => {
        const res = await axiosInstance.get<Order[]>(`/orders/user/${userId}`);
        return res.data;
    },

    getAll: async () => {
        const res = await axiosInstance.get<Order[]>("/orders");
        return res.data;
    },

    updateStatus: async (orderId: string, status: OrderStatus) => {
        await axiosInstance.patch(`/orders/${orderId}/status?status=${status}`);
    },

    cancel: async (orderId: string) => {
        await axiosInstance.patch(`/orders/${orderId}/cancel`);
    },
};