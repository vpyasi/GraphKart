import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaDatabase } from 'react-icons/fa';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        setShowDropdown(false);
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.href = '/login';
    };

    const toggleDropdown = () => setShowDropdown(prev => !prev);
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    const navLinks = (
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
                            ❤️
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
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-8xl mx-auto px-5 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center text-2xl font-bold text-blue-600 gap-2">
                    <FaDatabase className="text-blue-600 text-2xl" />
                    TechTrolley
                </Link>

                {/* Hamburger menu (mobile only) */}
                <div className="md:hidden">
                    <button onClick={toggleMobileMenu} className="text-2xl text-gray-800 focus:outline-none">
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Desktop menu */}
                <ul className="hidden md:flex space-x-6 items-center text-gray-800 font-medium">
                    {navLinks}
                </ul>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <ul className="md:hidden px-5 pb-4 space-y-3 bg-white border-t text-gray-800 font-medium">
                    {navLinks}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
