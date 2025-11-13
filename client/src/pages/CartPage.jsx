import { useEffect, useState } from "react";
import { getCart, updateCartItem, deleteCartItem } from "../api/cart.routes";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "sonner";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const res = await getCart();
      setItems(res.data);
    } catch {
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
    await updateCartItem(id, quantity);
    loadCart();
  };

  const removeItem = async (id) => {
    await deleteCartItem(id);
    toast.success("Removed from cart");
    loadCart();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white h-screen p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 && (
        <p className="text-gray-500">Your cart is empty.</p>
      )}

      <div className="space-y-6">
        {items.map(({ id, quantity, Product }) => (
          <div key={id} className="border p-4 rounded-md flex justify-between">
            <div>
              <h2 className="text-xl font-semibold">{Product.name}</h2>
              <p className="text-sm text-gray-600">{Product.category}</p>
              <p className="text-indigo-600 font-bold">${Product.price}</p>
            </div>

            <div className="flex items-center gap-4">
              <button className="px-3" onClick={() => updateQuantity(id, quantity - 1)}>-</button>
              <span>{quantity}</span>
              <button className="px-3" onClick={() => updateQuantity(id, quantity + 1)}>+</button>

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
    </div>
  );
}
