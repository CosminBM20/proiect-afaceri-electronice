import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMyOrders, getAllOrders } from "../api/order.routes";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "sonner";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = isAdmin ? await getAllOrders() : await getMyOrders();
        const data = res?.data?.data || [];
        setOrders(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">
          {isAdmin ? "All Orders" : "My Orders"}
        </h1>

        {orders.length === 0 ? (
          <p className="text-slate-400">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm text-slate-400">
                      Order #{order.id}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-emerald-400">
                      ${order.totalPrice?.toLocaleString()}
                    </span>
                    <span
                      className={
                        "text-xs px-2 py-1 rounded-full border " +
                        (order.status === "Completed"
                          ? "border-emerald-500 text-emerald-300"
                          : order.status === "Processing"
                          ? "border-yellow-400 text-yellow-300"
                          : "border-slate-500 text-slate-300")
                      }
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {isAdmin && order.User && (
                  <p className="text-xs text-slate-400 mb-2">
                    User:{" "}
                    <span className="text-slate-200">
                      {order.User.name} ({order.User.email})
                    </span>
                  </p>
                )}

                <div className="mt-2 border-t border-slate-800 pt-2 space-y-1">
                  {(order.OrderItems || []).map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-slate-300"
                    >
                      <span>
                        {item.Product?.name || "Unknown aircraft"}{" "}
                        <span className="text-xs text-slate-500">
                          x{item.quantity}
                        </span>
                      </span>
                      <span className="text-slate-400">
                        ${item.priceAtPurchase?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
