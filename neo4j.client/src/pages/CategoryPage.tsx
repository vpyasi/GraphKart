import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import imageMap from '../utils/imageMap';
import { Heart } from 'lucide-react';



type Product = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description?: string;
    tags?: string[];
};

const CategoryPage = () => {
    const { category } = useParams<{ category: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [desc, setDesc] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!category) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products?category=${category}&sortBy=${sortBy}&desc=${desc}`
             
                );
                setProducts(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category, sortBy, desc]);

    const handleSortChange = (field: string) => {
        if (sortBy === field) {
            setDesc(!desc);
        } else {
            setSortBy(field);
            setDesc(false);
        }
    };

    const goToDetails = (productId: string) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex justify-center gap-4 mb-6">
                <button
                    onClick={() => handleSortChange('price')}
                    className={`px-4 py-2 border rounded ${sortBy === 'price'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600'
                        }`}
                >
                    Price {sortBy === 'price' && (desc ? '↓' : '↑')}
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : products.length === 0 ? (
                <p className="text-center text-gray-500">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => {
                        const imageFilename = product.imageUrl.replace(/^\/?assets\//, '');
                        const normalized = imageFilename.endsWith('.jpg') ? imageFilename : imageFilename + '.jpg';
                        const imageSrc = imageMap[normalized] || imageMap['fallback.jpg'];

                        return (
                            <div
                                key={product.id}
                                className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition relative cursor-pointer"
                            >
                                {/* ❤️ Wishlist icon */}
                                <button className="absolute top-2 right-2 text-red-500 hover:text-red-600 z-10">
                                    <Heart className="w-5 h-5" />
                                </button>

                                <img
                                    src={imageSrc}
                                    alt={product.name}
                                    className="w-full h-52 object-cover hover:opacity-90 transition"
                                    onClick={() => setSelectedImage(imageSrc)}
                                    onDoubleClick={() => goToDetails(product.id)}
                                    onError={(e) => (e.currentTarget.src = imageMap['fallback.jpg'])}
                                />

                                <div className="p-4" onClick={() => goToDetails(product.id)}>
                                    <h3 className="text-lg font-semibold text-gray-800 break-words min-h-[48px]">
                                        {product.name}
                                    </h3>
                                    <p className="text-blue-600 font-bold mt-1">${product.price.toFixed(2)}</p>
                                    {product.description && (
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                            {product.description}
                                        </p>
                                    )}
                                    {product.tags && product.tags.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Tags: {product.tags.join(', ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            o
            {/* 🖼️ Large image popup modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedImage}
                            alt="Large View"
                            className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
