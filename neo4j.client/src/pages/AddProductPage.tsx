// frontend/src/pages/AddProductPage.tsx
import { useState } from 'react';
import axios from 'axios';

const AddProductPage = () => {
    const [product, setProduct] = useState({
        name: '',
        price: '',
        imageUrl: '',
        category: '',
        description: '',
        tags: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            await axios.post('https://localhost:7008/api/products/Add', {
                name: product.name,
                price: parseFloat(product.price),
                imageUrl: product.imageUrl,
                category: product.category,
                description: product.description,
                tags: product.tags.split(',').map(tag => tag.trim())
            });
            alert('Product added successfully!');
           setProduct({
                name: '',
                price: '',
                imageUrl: '',
                category: '',
                description: '',
                tags: ''
            });

        } catch (err) {
            console.error(err);
            alert('Error adding product');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Add New Product</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            id="name"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block mb-1 text-sm font-medium text-gray-700">Price (USD)</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            value={product.price}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block mb-1 text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            id="imageUrl"
                            name="imageUrl"
                            value={product.imageUrl}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                        <input
                            id="category"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                        <input
                            id="description"
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />                    
                    </div>
                    <div>                      
                        <label htmlFor="tags" className="block mb-1 text-sm font-medium text-gray-700">Tags (comma separated)</label>
                        <input
                            name="tags"
                            value={product.tags}
                            onChange={handleChange}
                            placeholder="Tags (comma separated)"
                            className="w-full border p-2 rounded"
                        />
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductPage;
