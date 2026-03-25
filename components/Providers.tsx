"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { setCart } from "@/store/cartSlice";
import { setFavorites } from "@/store/favoriteSlice";
import { SessionProvider, useSession } from "next-auth/react";

function StateSync({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const { data: session, status } = useSession();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const syncOnLoad = async () => {
            if (status === "authenticated") {
                try {
                    const res = await fetch("/api/user/cart");

                    if (res.ok) {
                        const text = await res.text();
                        if (text) {
                            const data = JSON.parse(text);
                            if (data.cart && data.cart.length > 0) {
                                dispatch(setCart(data.cart));
                            }
                        }
                    }
                } catch (error) {
                    console.error("Cart sync failed:", error);
                }
            } else if (status === "unauthenticated") {
                const saved = localStorage.getItem("strenoxa_cart");
                if (saved) dispatch(setCart(JSON.parse(saved)));
            }
            setIsLoaded(true);
        };

        if (status !== "loading") syncOnLoad();
    }, [status, dispatch]);

    useEffect(() => {
        if (!isLoaded) return;

        if (status === "authenticated") {
            fetch("/api/user/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cartItems }),
            });
        } else {
            localStorage.setItem("strenoxa_cart", JSON.stringify(cartItems));
        }
    }, [cartItems, status, isLoaded]);

    return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Provider store={store}>
                <StateSync>{children}</StateSync>
            </Provider>
        </SessionProvider>
    );
}