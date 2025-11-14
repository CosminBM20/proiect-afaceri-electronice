// client/src/pages/ProdutsPage.jsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchProducts, deleteProduct } from '../api/product.routes';
import { addToCart } from '../api/cart.routes';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const user = useSelector((state) => state.user.user);
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProducts();
        if (data && Array.isArray(data)) {
          setProducts(data);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleEditClick = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleDeleteClick = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setDeletingId(productId);
      const response = await deleteProduct(productId);

      if (response?.success) {
        setProducts(products.filter((p) => p.id !== productId));
        toast.success('Product deleted successfully');
      } else {
        toast.error(response?.message || 'Failed to delete product');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred while deleting the product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateClick = () => {
    navigate('/products/create');
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await addToCart(productId);

      if (response?.success) {
        toast.success("Added to cart!");
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        toast.error(response?.message || "Could not add to cart");
      }
    } catch (error) {
      toast.error("Error adding to cart");
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-slate-950 h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-slate-950 h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 font-semibold">No products available</p>
          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="mt-4 inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Product
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 h-screen overflow-y-auto py-10">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Aircraft Catalog</h2>
            <p className="text-sm text-slate-400 mt-1">Browse and manage available planes.</p>
          </div>
          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Product
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-xl bg-slate-900 border border-slate-800 shadow-md hover:shadow-emerald-500/20 transition-all duration-200 overflow-hidden"
            >
              <div className="relative">
                <img
                  alt={product.name}
                  src={product.image || 'https://via.placeholder.com/300'}
                  className="aspect-video w-full bg-slate-800 object-cover group-hover:scale-[1.03] transition-transform duration-200"
                />

                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button
                      type="button"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-md shadow-lg transition-colors duration-200"
                      onClick={() => handleEditClick(product.id)}
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-400 text-white p-2 rounded-md shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDeleteClick(product.id)}
                      disabled={deletingId === product.id}
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3
                      className="text-base font-semibold text-white cursor-pointer hover:text-emerald-400"
                      onClick={() => handleViewDetails(product.id)}
                    >
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-wide text-emerald-400">
                      {product.category}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-emerald-400">
                    ${product.price}
                  </p>
                </div>

                <p className="text-sm text-slate-400 line-clamp-2">
                  {product.description}
                </p>

                <button
                  className="mt-3 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-md transition"
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
