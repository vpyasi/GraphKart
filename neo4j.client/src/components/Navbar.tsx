import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaDatabase, FaUserCircle, FaArrowLeft } from 'react-icons/fa'; 

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        setShowDropdown(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.href = '/login';
    };

    const toggleDropdown = () => setShowDropdown(prev => !prev);

    const handleGoBack = () => navigate(-1);

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-8xl mx-auto px-5 py-3 flex items-center justify-between">                
                <div className="flex items-center gap-2">                
                    

                    <Link to="/" className="flex items-center text-2xl font-bold text-blue-600 gap-2">
                        <FaDatabase className="text-blue-600 text-2xl" />
                        TechTrolley
                    </Link>
                </div>
                
                <ul className="flex space-x-6 items-center text-gray-800 font-medium">
                    <li>
                        <Link to="/" className="hover:text-blue-600 transition">Home</Link>
                    </li>
                    <li>
                        <a href="/#products" className="hover:text-blue-600 transition">Products</a>
                    </li>

                    {!isLoggedIn ? (
                        <li>
                            <Link to="/login" className="hover:text-blue-600 transition">Login</Link>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link to="/admin" className="hover:text-blue-600 transition">Admin</Link>
                            </li>
                            <li className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition focus:outline-none bg-transparent"
                                >
                                    <FaUserCircle className="text-2xl" />
                                    <span className="text-sm font-semibold">Profile</span>
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-50">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </li>
                            <li>
                                <Link to="/wishlist" className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 011.09-6.318A4.5 4.5 0 0112 4.5a4.5 4.5 0 016.592 6.317L12 20.25 4.318 6.318z" />
                                    </svg>
                                    <span className="text-sm font-semibold">Wishlist</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l1.6 8M17 13l-1.6 8M9 21h6" />
                                    </svg>
                                    <span className="text-sm font-semibold">Bag</span>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;