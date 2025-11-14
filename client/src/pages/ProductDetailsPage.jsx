// client/src/pages/ProductDetailsPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { getProductById } from '../api/product.routes'
import { addToCart } from '../api/cart.routes'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await getProductById(id)

        if (res?.success || res?.data) {
          setProduct(res.data || res)
        } else {
          setError(res?.message || 'Failed to load product')
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching product')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    try {
      const response = await addToCart(product.id)

      if (response?.success) {
        toast.success('Added to cart!')
        window.dispatchEvent(new Event('cartUpdated'))
      } else {
        toast.error(response?.message || 'Could not add to cart')
      }
    } catch (error) {
      toast.error('Error adding to cart')
    }
  }

  if (loading) return <LoadingSpinner />

  if (error || !product) {
    return (
      <div className="bg-slate-950 h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-950 min-h-screen py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-400 hover:text-emerald-400 mb-6"
        >
          ← Back to products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
            <img
              src={product.image || 'https://via.placeholder.com/600x400'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-400 mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold text-white mb-3">
              {product.name}
            </h1>
            <p className="text-slate-300 mb-6">
              {product.description}
            </p>

            <div className="flex items-center gap-6 mb-6">
              <p className="text-2xl font-semibold text-emerald-400">
                ${product.price}
              </p>
              {typeof product.stock !== 'undefined' && (
                <p className="text-sm text-slate-400">
                  Stock: <span className="text-slate-200 font-medium">{product.stock}</span>
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="inline-flex items-center rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
