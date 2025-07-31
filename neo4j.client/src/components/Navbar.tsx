/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaDatabase, FaChevronRight } from 'react-icons/fa';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const mobileMenuRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        setShowDropdown(false);
        setIsMobileMenuOpen(false);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event: { target: any }) => {
            if (
                isMobileMenuOpen &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                overlayRef.current &&
                overlayRef.current.contains(event.target)
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsMobileMenuOpen(false);
        window.location.href = '/login';
    };

    const toggleDropdown = () => setShowDropdown(prev => !prev);
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const desktopNavLinks = (
        <>
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
                           
                            <span className="text-sm font-semibold">Wishlist</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/cart" className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition">
                            🛒
                            <span className="text-sm font-semibold">Bag</span>
                        </Link>
                    </li>
                </>
            )}
        </>
    );

    return (
        <>
            <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-8xl mx-auto px-5 py-3 flex items-center justify-between">
                    <Link to="/" className="flex items-center text-2xl font-bold text-blue-600 gap-2">
                        <FaDatabase className="text-blue-600 text-2xl" />
                        TechTrolley
                    </Link>

                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-2xl text-gray-800 focus:outline-none p-2"
                            aria-label="Toggle mobile menu"
                        >
                            <FaBars />
                        </button>
                    </div>

                    <ul className="hidden md:flex space-x-6 items-center text-gray-800 font-medium">
                        {desktopNavLinks}
                    </ul>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
                >
                    <div
                        ref={mobileMenuRef}
                        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}
                    >
                        <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white">
                            <div className="flex items-center gap-2">
                                <FaUserCircle className="text-2xl" />
                                <span className="font-semibold">
                                    {isLoggedIn ? 'Hello, User!' : 'Hello, Sign in'}
                                </span>
                            </div>
                            <button
                                onClick={closeMobileMenu}
                                className="text-2xl hover:text-gray-200 transition p-1"
                                aria-label="Close mobile menu"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="flex flex-col h-full">
                            <div className="flex-1 overflow-y-auto">
                                <div className="py-4">
                                    <h3 className="px-6 text-lg font-semibold text-gray-800 mb-3">
                                        Shop by Category
                                    </h3>
                                    <ul className="space-y-1">
                                        <li>
                                            <Link
                                                to="/"
                                                onClick={closeMobileMenu}
                                                className="flex items-center justify-between px-6 py-3 text-gray-800 hover:bg-gray-100 transition"
                                            >
                                                <span>Home</span>
                                                <FaChevronRight className="text-gray-400" />
                                            </Link>
                                        </li>
                                        <li>
                                            <a
                                                href="/#products"
                                                onClick={closeMobileMenu}
                                                className="flex items-center justify-between px-6 py-3 text-gray-800 hover:bg-gray-100 transition"
                                            >
                                                <span>Products</span>
                                                <FaChevronRight className="text-gray-400" />
                                            </a>
                                        </li>
                                        {isLoggedIn && (
                                            <>
                                                <li>
                                                    <Link
                                                        to="/admin"
                                                        onClick={closeMobileMenu}
                                                        className="flex items-center justify-between px-6 py-3 text-gray-800 hover:bg-gray-100 transition"
                                                    >
                                                        <span>Admin Panel</span>
                                                        <FaChevronRight className="text-gray-400" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/wishlist"
                                                        onClick={closeMobileMenu}
                                                        className="flex items-center justify-between px-6 py-3 text-gray-800 hover:bg-gray-100 transition"
                                                    >
                                                        <span>❤️ Wishlist</span>
                                                        <FaChevronRight className="text-gray-400" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/cart"
                                                        onClick={closeMobileMenu}
                                                        className="flex items-center justify-between px-6 py-3 text-gray-800 hover:bg-gray-100 transition"
                                                    >
                                                        <span>🛒 Shopping Bag</span>
                                                        <FaChevronRight className="text-gray-400" />
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>

                                <div className="border-t py-4">
                                    <h3 className="px-6 text-lg font-semibold text-gray-800 mb-3">
                                        Account & Settings
                                    </h3>
                                    <ul className="space-y-1">
                                        {!isLoggedIn ? (
                                            <li>
                                                <Link
                                                    to="/login"
                                                    onClick={closeMobileMenu}
                                                    className="flex items-center justify-between px-6 py-3 text-blue-600 hover:bg-gray-100 transition font-semibold"
                                                >
                                                    <span>Sign In</span>
                                                    <FaChevronRight className="text-gray-400" />
                                                </Link>
                                            </li>
                                        ) : (
                                            <>
                                                <li>
                                                    <div className="flex items-center justify-between px-6 py-3 text-gray-800 hover:bg-gray-100 transition">
                                                        <span>Your Profile</span>
                                                        <FaChevronRight className="text-gray-400" />
                                                    </div>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center justify-between w-full px-6 py-3 text-red-600 hover:bg-gray-100 transition text-left"
                                                    >
                                                        <span>Sign Out</span>
                                                        <FaChevronRight className="text-gray-400" />
                                                    </button>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
