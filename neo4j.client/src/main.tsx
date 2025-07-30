import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; 
import App from './App.tsx';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext.tsx';


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <WishlistProvider>
        <CartProvider>
            <App />
            </CartProvider>
        </WishlistProvider>
  </StrictMode>,
);
