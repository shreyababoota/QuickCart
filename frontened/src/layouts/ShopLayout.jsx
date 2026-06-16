import { Outlet, Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'

export default function ShopLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#EAEDED]">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <footer className="mt-auto bg-[#232F3E] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Get to Know Us</h3>
              <ul className="space-y-2 text-sm text-[#D5D9D9]">
                <li><Link to="/" className="hover:text-[#FF9900]">About AmaCart</Link></li>
                <li><Link to="/assistant" className="hover:text-[#FF9900]">AI Shopping Assistant</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Make Money with Us</h3>
              <ul className="space-y-2 text-sm text-[#D5D9D9]">
                <li><Link to="/admin" className="hover:text-[#FF9900]">Sell on AmaCart</Link></li>
                <li><Link to="/admin/inventory" className="hover:text-[#FF9900]">Manage Inventory</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Let Us Help You</h3>
              <ul className="space-y-2 text-sm text-[#D5D9D9]">
                <li><Link to="/plans" className="hover:text-[#FF9900]">Smart Plans</Link></li>
                <li><Link to="/orders" className="hover:text-[#FF9900]">Your Orders</Link></li>
                <li><Link to="/profile" className="hover:text-[#FF9900]">Your Account</Link></li>
                <li><Link to="/cart" className="hover:text-[#FF9900]">Your Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Shop by Category</h3>
              <ul className="space-y-2 text-sm text-[#D5D9D9]">
                <li>Electronics</li>
                <li>Fashion</li>
                <li>Home & Kitchen</li>
                <li>Grocery & Essentials</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-[#131921] pt-6 text-center text-sm text-[#D5D9D9]">
            © {new Date().getFullYear()} AmaCart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
