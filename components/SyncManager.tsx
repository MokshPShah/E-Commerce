"use client";

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCart, CartItem } from '@/store/cartSlice';
import { setFavorites, FavoriteItem } from '@/store/favoriteSlice';

export default function SyncManager() {
    const { status } = useSession();
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const favoriteItems = useSelector((state: RootState) => state.favorites.items);

    const hasSynced = useRef(false);

    useEffect(() => {
        if (status === 'authenticated' && !hasSynced.current) {
            hasSynced.current = true;
            syncData();
        }
    }, [status]);

    const syncData = async () => {
        try {
            const [cartRes, favRes] = await Promise.all([
                fetch('/api/user/cart'),
                fetch('/api/user/favorites')
            ]);

            const dbCartData = await cartRes.json();
            const dbFavData = await favRes.json();

            const dbCart: CartItem[] = dbCartData.cart || [];
            const dbFavs: FavoriteItem[] = dbFavData.favorites || [];

            const mergedCart = [...dbCart];
            cartItems.forEach(localItem => {
                const existing = mergedCart.find(
                    dbItem => dbItem._id === localItem._id && dbItem.flavor === localItem.flavor
                );
                if (existing) {
                    existing.quantity += localItem.quantity;
                } else {
                    mergedCart.push(localItem);
                }
            });

            const mergedFavMap = new Map<string, FavoriteItem>();
            dbFavs.forEach((fav) => mergedFavMap.set(fav._id, fav));
            favoriteItems.forEach((fav) => mergedFavMap.set(fav._id, fav));
            const mergedFavorites = Array.from(mergedFavMap.values());

            dispatch(setCart(mergedCart));
            dispatch(setFavorites(mergedFavorites));

            await Promise.all([
                fetch('/api/user/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cartItems: mergedCart.map(item => ({
                            productId: item._id,
                            quantity: item.quantity,
                            flavor: item.flavor
                        }))
                    })
                }),
                fetch('/api/user/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        favorites: mergedFavorites.map(item => item._id)
                    })
                })
            ]);

        } catch (error) {
            console.error("Failed to sync user data:", error);
        }
    };

    return null;
}