import { useCart } from "../../cart/context/CartContext";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const { addToCart, items } = useCart();

  const inCart = items.find((i) => i._id === product._id);

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.productName} added to cart!`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={product.image}
        alt={product.productName}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src =
            "https://placehold.co/400x200?text=No+Image";
        }}
      />

      <div className="p-4">
        <span className="text-xs text-blue-500 font-semibold uppercase tracking-wide">
          {product.category || "General"}
        </span>

        <h2 className="text-gray-800 font-bold text-lg mt-1 truncate">
          {product.productName}
        </h2>

        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-blue-600 font-bold text-xl">
            ₹{product.price}
          </span>

          <span className="text-xs text-gray-400">
            Stock: {product.stock ?? "N/A"}
          </span>
        </div>

        <button
          onClick={handleAdd}
          className={`w-full mt-4 py-2 rounded-lg font-semibold text-sm transition ${
            inCart
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {inCart ? `✓ In Cart (${inCart.quantity})` : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}