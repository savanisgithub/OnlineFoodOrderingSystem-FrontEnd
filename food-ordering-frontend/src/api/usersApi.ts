import axiosInstance from "./axiosInstance";
import type { UserRole } from "../types/auth";

export interface UserDTO {
    userId: string;
    name: string;
    email: string;
    password?: string | null;
    role: UserRole;
}

export const userApi = {
    getAll: async () => {
        const res = await axiosInstance.get<UserDTO[]>("/users");
        return res.data;
    },

    getById: async (userId: string) => {
        const res = await axiosInstance.get<UserDTO>(`/users/${userId}`);
        return res.data;
    },

    create: async (data: Partial<UserDTO>) => {
        await axiosInstance.post("/users", data);
    },

    update: async (userId: string, data: Partial<UserDTO>) => {
        await axiosInstance.patch(`/users/${userId}`, data);
    },

    remove: async (userId: string) => {
        await axiosInstance.delete(`/users/${userId}`);
    },
};