import { createContext, useContext, useCallback, useState, type ReactNode } from "react";
import { cartApi } from "../api/cartApi";
import type { CartItem } from "../types";

interface CartContextType {
    cartCount: number;
    refreshCartCount: (userId: string) => Promise<void>;
    cartItems: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Memoize refreshCartCount so it doesn't change on every render
    const refreshCartCount = useCallback(async (userId: string) => {
        try {
            const cart = await cartApi.getByUser(userId);
            setCartItems(cart.cartItems || []);
            const count = (cart.cartItems || []).reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(count);
        } catch {
            setCartCount(0);
            setCartItems([]);
        }
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, refreshCartCount, cartItems }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}
