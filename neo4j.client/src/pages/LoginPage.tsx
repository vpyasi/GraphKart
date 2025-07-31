import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/products/login`, {
                email,
                password,
            });

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/');
        } catch (err: any) {
            if (err.response) {
                if (err.response.status === 404) {
                    setError('You have not signed up yet.');
                } else if (err.response.status === 401) {
                    setError(err.response.data.message || 'Invalid credentials.');
                } else {
                    setError('Login failed. Please try again.');
                }
            } else {
                setError('Network error. Please try again.');
            }
        }
    };

    const goToRegister = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/signup');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold text-blue-600">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Login to your account</p>
                </div>

                <form className="space-y-5">
                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div className="text-right text-sm">
                        <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
                    >
                        Login
                    </button>

                    <p className="text-sm text-center text-gray-600">
                        Don’t have an account?{' '}
                        <button
                            onClick={goToRegister}
                            className="text-blue-600 hover:underline"
                            type="button"
                        >
                            Register
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}
