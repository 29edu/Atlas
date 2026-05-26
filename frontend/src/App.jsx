import "./App.css";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./features/cart/context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import LoginForm from "./features/auth/components/LoginForm";
import SignUpForm from "./features/auth/components/SignUpForm";
import ProductsPage from "./features/products/pages/ProductPage";
import CartPage from "./features/cart/pages/CartPage";
import CheckoutPage from "./features/checkout/pages/CheckoutPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />

          {/* Main */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Default */}
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;