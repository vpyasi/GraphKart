/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import imageMap from '../utils/imageMap';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description?: string;
    tags?: string[];
}

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);

    const { addToCart } = useCart();
    const { addToWishlist } = useWishlist();
    const user = { name: "Ayush" };

    useEffect(() => {
        if (!id) {
            setError('No product ID provided');
            setIsLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const res = await axios.get(`https://graphkart.onrender.com/api/products/${id}`);
                if (res.data.id) {
                    setProduct(res.data);
                } else {
                    setError('Invalid product data received');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to load product');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToWishlist = async () => {
        if (!product?.id || !user?.name) {
            alert("Missing product or user info");
            return;
        }

        try {
            await axios.post('https://graphkart.onrender.com/api/products/wishlist', {
                productId: product.id,
                userName: user.name
            });

            addToWishlist({
                id: Number(product.id),
                name: product.name,
                price: product.price,
                image: imageMap[getFileName(product.imageUrl)],
            });
           
        } catch (err) {
            console.error('Wishlist error:', err);
            alert('Failed to add to wishlist');
        }
    };

    useEffect(() => {
        const markProductAsViewed = async () => {
            const viewedKey = `viewed_${id}_Ayush@gmail.com`;
            if (localStorage.getItem(viewedKey)) return;

            try {
                await axios.post('https://graphkart.onrender.com/api/products/viewed', {
                    username: 'Ayush@gmail.com',
                    productId: id
                });

                localStorage.setItem(viewedKey, 'true');
            } catch (err) {
                console.error('Error marking product as viewed:', err);
            }
        };

        if (id) markProductAsViewed();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        const imageKey = getFileName(product?.imageUrl || '');
        const imageSrc = imageMap[imageKey] || imageMap['fallback.jpg'];

        addToCart({
            id: Number(product.id),
            name: product.name,
            price: product.price,
            quantity: 1,
            image: imageSrc,
        });
    };

    const getFileName = (url: string): string => {
        if (!url) return 'fallback.jpg';
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    if (isLoading) return <div className="text-center p-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-10">{error}</div>;

    const imageKey = getFileName(product?.imageUrl || '');
    const imageSrc = imageMap[imageKey] || imageMap['fallback.jpg'];

    return (
        <>
            {/* Page Content */}
            <div className="max-w-6xl mx-auto px-6 py-10 relative z-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Product Image */}
                    <div className="w-full">
                        <img
                            src={imageSrc}
                            alt={product?.name || 'Product'}
                            className="w-full h-auto rounded-xl shadow-lg object-cover cursor-pointer"
                            onClick={() => setShowOverlay(true)}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col space-y-6">
                        <h1 className="text-4xl font-extrabold text-gray-800">{product?.name}</h1>
                        <p className="text-2xl text-blue-600 font-semibold">
                            {product?.price ? `$${product.price.toFixed(2)}` : 'Price not available'}
                        </p>
                        <p className="text-gray-700 text-base leading-relaxed">
                            {product?.description?.trim() || 'No description available.'}
                        </p>

                        {product?.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map(tag => (
                                    <span key={tag} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleAddToWishlist}
                                className="flex items-center gap-2 bg-white text-gray-800 border border-gray-300 hover:border-indigo-500 hover:text-indigo-600 px-5 py-2 rounded-xl shadow-sm hover:shadow-md transition duration-200"
                            >
                                <span className="text-lg">❤️</span> Add to Wishlist
                            </button>

                            <button
                                onClick={handleAddToCart}
                                className="flex items-center gap-2 bg-white text-gray-800 border border-gray-300 hover:border-indigo-500 hover:text-indigo-600 px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition duration-200"
                            >
                                🛒 Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay Animation */}
            <AnimatePresence>
                {showOverlay && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowOverlay(false)}
                    >
                        <motion.img
                            src={imageSrc}
                            alt="Zoomed"
                            className="max-w-[600px] w-full h-auto rounded-lg shadow-xl"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
