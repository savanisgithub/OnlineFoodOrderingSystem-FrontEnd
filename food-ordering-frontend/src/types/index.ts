export type FoodStatus = "AVAILABLE" | "OUT_OF_STOCK";
export type OrderStatus = "PLACED" | "PREPARING" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Category {
    categoryId: string;
    categoryName: string;
    description?: string;
}

export interface FoodItem {
    foodId: string;
    foodName: string;
    description?: string;
    price: number;
    imageUrl?: string;
    status: FoodStatus;
    categoryId: string;
    categoryName?: string;
}

export interface CartItem {
    cartItemId: string;
    foodId: string;
    foodName: string;
    imageUrl?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    food?: FoodItem;
}

export interface Cart {
    cartId: string;
    userId: string;
    userName: string;
    cartItems: CartItem[];
    totalAmount: number;
}

export interface OrderItem {
    orderItemId: string;
    foodId: string;
    foodName: string;
    imageUrl?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface Order {
    orderId: string;
    userId: string;
    userName: string;
    status: OrderStatus;
    totalAmount: number;
    orderDate: string;
    orderItems: OrderItem[];
}

export interface Payment {
    paymentId: string;
    orderId: string;
    amount: number;
    paymentMethod: string;
    status: PaymentStatus;
    paymentDate: string;
}
