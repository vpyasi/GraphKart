import { useEffect, useState } from 'react';
import axios from 'axios';
import imageMap from '../utils/imageMap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type Product = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description?: string;
    tags?: string[];
};

interface ProductListProps {
    onProductClick: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onProductClick }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Failed to fetch products:', error);
                setError('Unable to load featured products.');
                setLoading(false);
            });
    }, []);

    return (
        <motion.section
            id="products"
            className="w-full px-4 py-10 max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.h3
                className="text-3xl font-bold mb-8 text-gray-800 text-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                Featured Products
            </motion.h3>

            {loading ? (
                <p className="text-center text-blue-600 animate-pulse">Loading products...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : products.length === 0 ? (
                <p className="text-center text-gray-500">No featured products available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {products.map((product, index) => {
                        const imageSrc = imageMap[product.imageUrl] || imageMap['fallback.jpg'];

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    to={`/product/${product.id}`}
                                    onClick={() => onProductClick(product.id)}
                                    className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                                >
                                    <div className="w-full h-[220px] overflow-hidden">
                                        <img
                                            src={imageSrc}
                                            alt={product.name}
                                            className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="p-4 flex flex-col flex-grow justify-between">
                                        <div>
                                            <p className="text-blue-600 font-bold mt-2">
                                                ${product.price.toFixed(2)}
                                            </p>
                                            {product.description && (
                                                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                                            )}
                                            {product.tags && product.tags.length > 0 && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Tags: {product.tags.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                        >
                                            Add to Cart
                                        </motion.button>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.section>
    );
};

export default ProductList;
