import React from "react";
import { Heart, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist } = useWishlist();

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-600" />
                Your Wishlist
            </h2>

            {wishlistItems.length === 0 ? (
                <div className="text-center text-gray-500">Your wishlist is empty.</div>
            ) : (
                <div className="bg-white rounded-lg shadow p-6 space-y-6">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 rounded object-cover"
                                />
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                                    <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="text-sm text-red-500 hover:underline mt-1 flex items-center gap-1"
                                >
                                    <Trash2 className="w-4 h-4" /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
