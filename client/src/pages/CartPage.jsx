import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCart, updateCartItem, deleteCartItem } from "../api/cart.routes";
import axiosAuth from "../axios/axiosAuth";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      const data = res?.data || res?.data?.data || [];
      setItems(data);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartItem(id, quantity);
      await loadCart();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (id) => {
    try {
      await deleteCartItem(id);
      toast.success("Removed from cart");
      await loadCart();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const totalPrice = items.reduce((sum, item) => {
    const price = item.Product?.price || 0;
    return sum + price * (item.quantity || 0);
  }, 0);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setPlacingOrder(true);
      const res = await axiosAuth.post("/orders/place");

      if (res?.data?.success) {
        toast.success("Order placed successfully!");
        setItems([]);
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/products");
      } else {
        toast.error(res?.data?.message || "Failed to place order");
      }
    } catch (err) {
      toast.error("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
  <div className="h-screen flex flex-col bg-white">

    {/* TITLU */}
    <h1 className="text-3xl font-bold p-6">Your Cart</h1>

    {/* LISTA PRODUSELOR — SCROLLABILĂ */}
    <div className="flex-1 overflow-y-auto px-6 pb-32">
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {items.map(({ id, quantity, Product }) => (
            <div
              key={id}
              className="border p-4 rounded-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{Product?.name}</h2>
                <p className="text-sm text-gray-600">{Product?.category}</p>
                <p className="text-indigo-600 font-bold">
                  ${Product?.price}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  className="px-3 text-lg"
                  onClick={() => updateQuantity(id, quantity - 1)}
                >
                  -
                </button>

                <span>{quantity}</span>

                <button
                  className="px-3 text-lg"
                  onClick={() => updateQuantity(id, quantity + 1)}
                >
                  +
                </button>

                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={() => removeItem(id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* BOTTOM BAR FIXED */}
    {items.length > 0 && (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 flex justify-between items-center">
        <p className="text-lg font-semibold">
          Total:{' '}
          <span className="text-indigo-600">
            ${totalPrice.toLocaleString()}
          </span>
        </p>

        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md disabled:opacity-60"
        >
          {placingOrder ? 'Placing order...' : 'Place Order'}
        </button>
      </div>
    )}

  </div>
);

}
