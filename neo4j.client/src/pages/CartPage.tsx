import React from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
    const { cartItems, removeFromCart } = useCart();
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                Your Cart
            </h2>

            {cartItems.length === 0 ? (
                <div className="text-center text-gray-500">Your cart is empty.</div>
            ) : (
                <div className="bg-white rounded-lg shadow p-6 space-y-6">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    <p className="text-sm text-gray-600">Unit Price: ${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-lg font-bold text-blue-600">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-sm text-red-500 hover:underline mt-1 flex items-center gap-1"
                                >
                                    <Trash2 className="w-4 h-4" /> Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between items-center pt-4 border-t">
                        <h3 className="text-xl font-bold text-gray-800">Total</h3>
                        <p className="text-xl font-bold text-blue-700">${total.toFixed(2)}</p>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded transition">
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
}
