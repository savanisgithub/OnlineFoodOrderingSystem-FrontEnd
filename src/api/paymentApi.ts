import axiosInstance from "./axiosInstance";
import type { Payment, PaymentStatus } from "../types";

export const paymentApi = {
    create: async (orderId: string, paymentMethod: string) => {
        await axiosInstance.post("/payments", {
            orderId,
            paymentMethod,
            status: "PENDING",
        });
    },

    getByOrder: async (orderId: string) => {
        const res = await axiosInstance.get<Payment>(`/payments/order/${orderId}`);
        return res.data;
    },

    getAll: async () => {
        const res = await axiosInstance.get<Payment[]>("/payments");
        return res.data;
    },

    updateStatus: async (paymentId: string, status: PaymentStatus) => {
        await axiosInstance.patch(`/payments/${paymentId}/status?status=${status}`);
    },
};