/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/SignupPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/products/register`, form);
            console.log("API URL:", import.meta.env.VITE_API_BASE_URL)
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md animate-fade-in">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Create an Account
                </h2>

                {error && (
                    <div className="mb-4 text-center text-sm text-red-600 bg-red-100 py-2 px-4 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Name"
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                        />

                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter a strong password"
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Sign Up
                    </button>

                    <p className="text-sm text-center text-gray-600">
                        Already have an account?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            className="text-blue-600 hover:underline cursor-pointer"
                        >
                            Login here
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
