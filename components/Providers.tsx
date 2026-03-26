"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "@/store/store";
import { useEffect, useState, useRef } from "react";
import { setCart, CartItem } from "@/store/cartSlice";
import { setFavorites, FavoriteItem } from "@/store/favoriteSlice";
import { SessionProvider, useSession } from "next-auth/react";

function StateSync({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const { status } = useSession();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const favoriteItems = useSelector((state: RootState) => state.favorites.items);
    
    const [isLoaded, setIsLoaded] = useState(false);
    const hasMerged = useRef(false);

    // 1. Initial Load & Merge Logic
    useEffect(() => {
        const syncOnLoad = async () => {
            if (status === "authenticated" && !hasMerged.current) {
                hasMerged.current = true;
                try {
                    // Fetch Database State
                    const [cartRes, favRes] = await Promise.all([
                        fetch("/api/user/cart").catch(() => null),
                        fetch("/api/user/favorites").catch(() => null)
                    ]);

                    const dbCartData = cartRes?.ok ? await cartRes.json() : { cart: [] };
                    const dbFavData = favRes?.ok ? await favRes.json() : { favorites: [] };

                    // Fetch Local Guest State
                    const localCartStr = localStorage.getItem("strenoxa_cart");
                    const localFavStr = localStorage.getItem("strenoxa_favorites");
                    const localCart: CartItem[] = localCartStr ? JSON.parse(localCartStr) : [];
                    const localFavs: FavoriteItem[] = localFavStr ? JSON.parse(localFavStr) : [];

                    // Merge Carts (Add quantities for matching ID + Flavor)
                    const mergedCart = [...(dbCartData.cart || [])];
                    localCart.forEach(localItem => {
                        const existing = mergedCart.find(
                            dbItem => dbItem._id === localItem._id && dbItem.flavor === localItem.flavor
                        );
                        if (existing) {
                            existing.quantity += localItem.quantity;
                        } else {
                            mergedCart.push(localItem);
                        }
                    });

                    // Merge Favorites (Ensure unique IDs)
                    const mergedFavMap = new Map<string, FavoriteItem>();
                    (dbFavData.favorites || []).forEach((fav: FavoriteItem) => mergedFavMap.set(fav._id, fav));
                    localFavs.forEach((fav: FavoriteItem) => mergedFavMap.set(fav._id, fav));
                    const mergedFavorites = Array.from(mergedFavMap.values());

                    // Update Redux
                    dispatch(setCart(mergedCart));
                    dispatch(setFavorites(mergedFavorites));

                    // Clean up local storage after successful merge
                    localStorage.removeItem("strenoxa_cart");
                    localStorage.removeItem("strenoxa_favorites");

                } catch (error) {
                    console.error("Data sync failed:", error);
                } finally {
                    setIsLoaded(true);
                }
            } else if (status === "unauthenticated") {
                // Load guest data into Redux
                const savedCart = localStorage.getItem("strenoxa_cart");
                const savedFavs = localStorage.getItem("strenoxa_favorites");
                
                if (savedCart) dispatch(setCart(JSON.parse(savedCart)));
                if (savedFavs) dispatch(setFavorites(JSON.parse(savedFavs)));
                
                setIsLoaded(true);
                hasMerged.current = false; // Reset merge flag if they log out
            }
        };

        if (status !== "loading") syncOnLoad();
    }, [status, dispatch]);

    // 2. Real-time Persistence Logic
    useEffect(() => {
        // Do not persist back to DB/Local until the initial load/merge is complete
        if (!isLoaded || status === "loading") return;

        if (status === "authenticated") {
            // Map the frontend state strictly to the database schema required by your POST routes
            const formattedCartForDb = cartItems.map(item => ({
                productId: item._id,
                quantity: item.quantity,
                flavor: item.flavor
            }));
            
            const formattedFavsForDb = favoriteItems.map(item => item._id);

            // Fire and forget POST requests to keep DB in sync with Redux
            fetch("/api/user/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cartItems: formattedCartForDb }),
            }).catch(e => console.error("Cart sync error", e));

            fetch("/api/user/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ favorites: formattedFavsForDb }),
            }).catch(e => console.error("Favorite sync error", e));

        } else {
            // Keep localStorage in sync for guests
            localStorage.setItem("strenoxa_cart", JSON.stringify(cartItems));
            localStorage.setItem("strenoxa_favorites", JSON.stringify(favoriteItems));
        }
    }, [cartItems, favoriteItems, status, isLoaded]);

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