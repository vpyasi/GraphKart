import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage';
import AddProductPage from './pages/AddProductPage';
import Verify from './pages/verify';
   
const AppRoutes = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Initially null
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [location]);

    if (isLoggedIn === null) {
        // You can also return a loading spinner here
        return <div className="text-center mt-20">Checking authentication...</div>;
    }

    return (
        <>
            {isLoggedIn && <Navbar />}

            <main className="flex-grow w-full">
                <Routes>
                    {!isLoggedIn ? (
                        <>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/verify" element={<Verify />} />
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/category/:category" element={<CategoryPage />} />
                            <Route path="/admin" element={<AddProductPage />} />
                            <Route path="/product/:id" element={<ProductDetailPage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </>
                    )}
                </Routes>
            </main>

            {isLoggedIn && <Footer />}
        </>
    );
};
function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen w-full bg-gray-100">
                <AppRoutes />
            </div>
        </Router>
    );
}

export default App;
