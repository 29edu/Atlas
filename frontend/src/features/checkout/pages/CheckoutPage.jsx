
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../cart/context/CartContext";
import { toast, ToastContainer } from "react-toastify";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay. Check your internet.");
        setLoading(false);
        return;
      }

      // Step 2: Create order on backend
      const initiateRes = await fetch(
        "http://localhost:3005/payment/initiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: "507f1f77bcf86cd799439011", // replace with real orderId later
            amount: total,
            currency: "INR",
          }),
        }
      );

      const initiateData = await initiateRes.json();

      if (!initiateData.success) {
        toast.error("Failed to initiate payment");
        setLoading(false);
        return;
      }

      const razorPayOrder = initiateData.razorPayOrder;

      // Step 3: Open Razorpay popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorPayOrder.amount,
        currency: razorPayOrder.currency,
        name: "Atlas Store",
        description: "Order Payment",
        order_id: razorPayOrder.id,
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [
                  { method: "upi" },
                ],
              },
            },
            sequence: ["block.upi"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async function (response) {
          // Step 4: Verify payment on backend
          try {
            const verifyRes = await fetch(
              "http://localhost:3005/payment/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorSignature: response.razorpay_signature,
                  orderId: "507f1f77bcf86cd799439011",
                  userId: user.id,
                  amount: total,
                  currency: "INR",
                  method: "UPI",
                  gatewayOrderId: response.razorpay_order_id,
                  gatewayPaymentId: response.razorpay_payment_id,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              clearCart();
              toast.success("Payment Successful! 🎉");
              setTimeout(() => navigate("/products"), 2000);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Error verifying payment");
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);

    } catch (err) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-400 text-xl mb-4">Nothing to checkout</p>
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
            onClick={() => navigate("/cart")}
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back to Cart
          </button>
          <h1 className="text-xl font-bold text-gray-800">Checkout</h1>
          <div />
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8">

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-gray-800 text-lg mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-gray-600">
                  <span>
                    {item.productName}{" "}
                    <span className="text-gray-400">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between text-gray-800 font-bold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : `Pay ₹${total} with Razorpay`}
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            🔒 Secured by Razorpay
          </p>
        </div>
      </div>
    </>
  );
}