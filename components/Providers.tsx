"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useEffect } from "react";
import { setCart } from "@/store/cartSlice";
import { setFavorites } from "@/store/favoriteSlice";

function StateSync({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const savedCart = localStorage.getItem("strenoxa_cart");
        const savedFavorites = localStorage.getItem("strenoxa_favorites")

        if (savedCart) {
            store.dispatch(setCart(JSON.parse(savedCart)));
        }
        if (savedFavorites) {
            store.dispatch(setFavorites(JSON.parse(savedFavorites)));
        }

        const unsubscribe = store.subscribe(() => {
            const state = store.getState()
            localStorage.setItem("strenoxa_cart", JSON.stringify(state.cart.items));
            localStorage.setItem("strenoxa_favorites", JSON.stringify(state.favorites.items));
        })

        return () => unsubscribe();
    }, [])

    return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <StateSync>{children}</StateSync>
        </Provider>
    );
}