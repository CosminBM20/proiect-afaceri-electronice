import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem,MenuItems,} from '@headlessui/react'
import { Bars3Icon, XMarkIcon, UserCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { logout } from '../store/slices/userSlice'
import { classNames } from '../utils/tailwind'
import { getCart } from '../api/cart.routes' // asigură-te că există funcția




const navigation = [
  { name: 'Homepage', href: '/' },
  { name: 'Products', href: '/products' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const loggedIn = useSelector((state) => state.user.loggedIn)
  const user = useSelector((state) => state.user.user);
  const [cartCount, setCartCount] = useState(0)

  const isActive = (href) => {
    // active pe ruta exactă sau orice sub-rută (ex: /products/123)
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const handleAuthClick = () => {
    if (loggedIn) {
      dispatch(logout())
      navigate('/')
    } else {
      navigate('/login')
    }
  }

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCart()
        const items = res?.data || res?.data?.data || []
        const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        setCartCount(total)
      } catch (e) {
        setCartCount(0)
      }
    }

    if (loggedIn) {
      fetchCart()
    } else {
      setCartCount(0)
    }

    const handleCartUpdated = () => {
      if (loggedIn) fetchCart()
    }

    window.addEventListener('cartUpdated', handleCartUpdated)
    return () => window.removeEventListener('cartUpdated', handleCartUpdated)
  }, [loggedIn])

  return (
    <Disclosure as="nav" className="relative bg-slate-900 border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-emerald-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <span className="text-emerald-400 font-bold text-lg tracking-tight">
                SkyShop
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={classNames(
                      isActive(item.href)
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Cart + Profile */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* CART ICON */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 mr-3"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-semibold w-5 h-5">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <UserCircleIcon className="size-8 rounded-full bg-slate-900 outline -outline-offset-1 outline-white/10 text-slate-300" />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-900 py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                
                <MenuItem>
                  <button
                    onClick={() => navigate('/profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                  >
                    My profile
                  </button>
                </MenuItem>


                {/* My orders */}
                <MenuItem>
                  <button
                    onClick={() => navigate('/orders')}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-200 data-focus:bg-slate-800 data-focus:outline-hidden hover:bg-slate-800"
                  >
                    My orders
                  </button>
                </MenuItem>

                {/* Sign in / out */}
                <MenuItem>
                  <button
                    onClick={handleAuthClick}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-200 data-focus:bg-slate-800 data-focus:outline-hidden hover:bg-slate-800"
                  >
                    {loggedIn ? 'Sign out' : 'Sign in'}
                  </button>
                </MenuItem>
              </MenuItems>

            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={classNames(
                isActive(item.href) ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
