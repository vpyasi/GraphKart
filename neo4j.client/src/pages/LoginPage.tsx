import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (email && password) {           
            localStorage.setItem('token', 'demo-token');
            localStorage.setItem('user', JSON.stringify({ name: email }));

            navigate('/');
        } else {
            alert('Please enter email and password');
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

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div className="text-right text-sm">
                        <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-100 text-white font-semibold py-2 rounded hover:bg-white-200 transition"
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
