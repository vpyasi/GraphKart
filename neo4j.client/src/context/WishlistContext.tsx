import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WishlistItem {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: number) => void;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// 🟦 Get the current user from localStorage (or use your auth context if you have one)
const getUserName = () => {
    const user = localStorage.getItem('user');
    try {
        return user ? JSON.parse(user)?.name : null;
    } catch {
        return null;
    }
};

export const useWishlist = (): WishlistContextType => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const userName = getUserName(); // 👈 Get user name
    const storageKey = userName ? `wishlist_${userName}` : 'wishlist_guest'; // 👈 User-specific key

    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
    }, [wishlistItems, storageKey]);

    const addToWishlist = (item: WishlistItem) => {
        setWishlistItems((prevItems) => {
            const exists = prevItems.find((i) => i.id === item.id);
            if (exists) return prevItems;
            return [...prevItems, item];
        });
    };

    const removeFromWishlist = (id: number) => {
        setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearWishlist = () => {
        setWishlistItems([]);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
