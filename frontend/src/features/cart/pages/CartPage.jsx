import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ToastContainer } from "react-toastify";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-400 text-xl mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50">

        {/* Navbar */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => navigate("/products")}
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back to Products
          </button>
          <h1 className="text-xl font-bold text-gray-800">Your Cart</h1>
          <div />
        </div>

        <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">

          {/* Cart Items */}
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center"
            >
              <img
                src={item.image}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded-xl"
                onError={(e) => {
                  e.target.src = "https://placehold.co/80x80?text=IMG";
                }}
              />

              <div className="flex-1">
                <h2 className="font-bold text-gray-800">{item.productName}</h2>
                <p className="text-blue-600 font-semibold">₹{item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 font-bold"
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <p className="text-gray-700 font-bold w-20 text-right">
                ₹{item.price * item.quantity}
              </p>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-400 hover:text-red-600 text-xl ml-2"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-4">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-gray-800 font-bold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition"
            >
              Proceed to Pay →
            </button>
          </div>

        </div>
      </div>
    </>
  );
}