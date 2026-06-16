import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Heart, Bell, Menu, Leaf, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SearchBar from './SearchBar'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Home' },
  { to: '/plans', label: 'Plans' },
  { to: '/assistant', label: 'AI Assistant' },
  { to: '/orders', label: 'Orders' },
]

export default function Navbar() {
  const { count, wishlistCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const pathname = location.pathname

  return (
    <header className="sticky top-0 z-40 bg-[#131921] text-white shadow-soft">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#FF9900] text-[#111111] shadow-glow">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight text-white sm:block">
            Ama<span className="text-[#FF9900]">Cart</span>
          </span>
        </Link>

        <div className="hidden max-w-3xl flex-1 sm:block">
          <SearchBar />
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-[#D5D9D9] transition-colors hover:bg-[#232F3E] hover:text-white",
                pathname === l.to && "bg-[#232F3E] text-white",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-[#232F3E] hover:text-white" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#FF9900]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 border-[#DDDDDD] bg-white">
              <DropdownMenuLabel className="text-[#111111]">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex-col items-start gap-0.5 text-[#111111]">
                <span className="font-medium">Flash deal live</span>
                <span className="text-xs text-[#565959]">Electronics up to 40% off — expires soon</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex-col items-start gap-0.5 text-[#111111]">
                <span className="font-medium">Order ORD-1042 delivered</span>
                <span className="text-xs text-[#565959]">Rate your items to earn rewards</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild variant="ghost" className="relative inline-flex items-center gap-2 text-white hover:bg-[#232F3E] hover:text-white" aria-label="Wishlist">
            <Link to="/wishlist">
              <Heart className="h-4 w-4" />
              {/* <span className="text-sm font-medium">Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''}</span> */}
              {wishlistCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full border-0 px-1 text-[10px] bg-[#FF9900] text-[#111111]">
                  {wishlistCount}
                </Badge>
              )}
            </Link>
          </Button>

          <Button asChild variant="ghost" size="icon" className="relative text-white hover:bg-[#232F3E] hover:text-white" aria-label="Cart">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full border-0 px-1 text-[10px] bg-[#FF9900] text-[#111111]">
                  {count}
                </Badge>
              )}
            </Link>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-[#FF9900] text-lg text-[#111111] shadow-sm">
                  {user.avatar}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-[#DDDDDD] bg-white">
                <DropdownMenuLabel className="flex flex-col text-[#111111]">
                  <span>{user.name}</span>
                  <span className="text-xs font-normal text-[#565959]">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-[#111111]">
                  <Link to="/plans">Smart Plans</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-[#111111]">
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-[#111111]">
                  <Link to="/orders">Order History</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-[#111111]">
                  <Link to="/admin"><LayoutDashboard className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-[#111111]">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Button asChild variant="outline" size="sm" className="border-[#DDDDDD] bg-white text-[#111111] hover:bg-[#F7F7F7]">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="text-white hover:bg-[#232F3E] hover:text-white lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="border-t border-[#232F3E] bg-[#232F3E] px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto no-scrollbar text-sm text-white">
          <span className="shrink-0 font-semibold">Shop by Category</span>
          {['Electronics', 'Fashion', 'Home & Kitchen', 'Grocery', 'Beauty', 'Books', 'Sports', 'Toys', 'Automotive', 'Pet Supplies'].map((cat) => (
            <span key={cat} className="shrink-0 cursor-pointer whitespace-nowrap text-[#D5D9D9] transition-colors hover:text-[#FF9900]">
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 pb-3 pt-2 sm:hidden">
        <SearchBar />
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-[#232F3E] bg-[#131921] px-4 pb-3 pt-2 lg:hidden">
          {[...links, { to: "/wishlist", label: "Wishlist" }, { to: "/admin", label: "Admin Dashboard" }].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-[#232F3E]"
            >
              {l.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="mt-2 flex gap-2 border-t border-[#232F3E] pt-3">
              <Button asChild variant="outline" size="sm" className="flex-1 border-[#DDDDDD] bg-white text-[#111111]" onClick={() => setOpen(false)}>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="flex-1" onClick={() => setOpen(false)}>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      )}
    </header>
  )
}
