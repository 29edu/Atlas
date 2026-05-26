
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ProductCard from "../components/ProductCard";
import { useCart } from "../../cart/context/CartContext";
import { useAuth } from "../../../context/AuthContext";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { totalItems } = useCart();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3002/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        } else {
          toast.error("Failed to load products");
        }
      } catch {
        toast.error("Cannot connect to product service");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50">

        {/* Navbar */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">Atlas Store</h1>
          <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="text-gray-500 hover:text-red-500 text-sm font-medium transition"
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="relative bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            🛒 Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-400 text-lg">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-400 text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}