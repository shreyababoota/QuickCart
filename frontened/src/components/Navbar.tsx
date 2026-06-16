// import { Link, useRouterState } from "@tanstack/react-router";
// import { ShoppingCart, Heart, Bell, Menu, Moon, Sun, Leaf, LayoutDashboard } from "lucide-react";
// import { useState } from "react";
// import { useCart } from "@/context/CartContext";
// import { useAuth } from "@/context/AuthContext";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import SearchBar from "./SearchBar";
// import { cn } from "@/lib/utils";

// const links = [
//   { to: "/", label: "Home" },
//   { to: "/assistant", label: "AI Assistant" },
//   { to: "/orders", label: "Orders" },
// ];

// export default function Navbar() {
//   const { count } = useCart();
//   const { user, isAuthenticated, logout } = useAuth();
//   const [open, setOpen] = useState(false);
//   const pathname = useRouterState({ select: (s) => s.location.pathname });

//   return (
//     <header className="sticky top-0 z-40 border-b border-[#232F3E] bg-[#131921] text-white shadow-soft">
//       <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
//         <Link to="/" className="flex shrink-0 items-center gap-2">
//           <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FF9900] text-[#111111] shadow-glow">
//             <Leaf className="h-5 w-5" />
//           </span>
//           <span className="hidden text-lg font-extrabold tracking-tight text-white sm:block">
//             Ama<span className="text-[#FF9900]">Cart</span>
//           </span>
//         </Link>

//         <div className="hidden flex-1 sm:block max-w-3xl">
//           <SearchBar />
//         </div>

//         <nav className="hidden items-center gap-1 lg:flex">
//           {links.map((l) => (
//             <Link
//               key={l.to}
//               to={l.to}
//               className={cn(
//                 "rounded-lg px-3 py-2 text-sm font-medium text-[#D5D9D9] transition-colors hover:bg-[#232F3E] hover:text-white",
//                 pathname === l.to && "bg-[#232F3E] text-white",
//               )}
//             >
//               {l.label}
//             </Link>
//           ))}
//         </nav>

//         <div className="ml-auto flex items-center gap-1 lg:ml-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="relative text-white hover:bg-[#232F3E] hover:text-white" aria-label="Notifications">
//                 <Bell className="h-5 w-5" />
//                 <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-72">
//               <DropdownMenuLabel>Notifications</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem className="flex-col items-start gap-0.5">
//                 <span className="font-medium">⚡ Flash deal live</span>
//                 <span className="text-xs text-muted-foreground">Strawberries 25% off — expires soon</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem className="flex-col items-start gap-0.5">
//                 <span className="font-medium">📦 Order ORD-1042 delivered</span>
//                 <span className="text-xs text-muted-foreground">Rate your items to earn rewards</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           <Button asChild variant="ghost" className="inline-flex items-center gap-2 text-white hover:bg-[#232F3E] hover:text-white" aria-label="Wishlist">
//             <Link to="/wishlist">
//               <Heart className="h-4 w-4" />
//               <span className="text-sm font-medium">Wishlist</span>
//             </Link>
//           </Button>

//           <Button asChild variant="ghost" size="icon" className="relative text-white hover:bg-[#232F3E] hover:text-white" aria-label="Cart">
//             <Link to="/cart">
//               <ShoppingCart className="h-5 w-5" />
//               {count > 0 && (
//                 <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1 text-[10px] bg-[#FF9900] text-[#111111]">
//                   {count}
//                 </Badge>
//               )}
//             </Link>
//           </Button>

//           {isAuthenticated ? (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <button className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-[#FF9900] text-lg text-[#111111] shadow-sm">
//                   {user.avatar}
//                 </button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuLabel className="flex flex-col">
//                   <span>{user.name}</span>
//                   <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem asChild>
//                   <Link to="/profile">My Profile</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link to="/orders">Order History</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link to="/admin"><LayoutDashboard className="mr-2 h-4 w-4" />Admin Dashboard</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (
//             <div className="hidden items-center gap-2 lg:flex">
//               <Button asChild variant="outline" size="sm" className="border-[#FF9900] bg-white text-[#131921] hover:bg-[#232F3E] hover:text-white">
//                 <Link to="/login">Login</Link>
//               </Button>
//               <Button asChild size="sm" className="bg-[#FF9900] text-[#111111] hover:bg-[#E68A00]">
//                 <Link to="/signup">Sign Up</Link>
//               </Button>
//             </div>
//           )}

//           <Button variant="ghost" size="icon" className="text-white hover:bg-[#232F3E] hover:text-white lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
//             <Menu className="h-5 w-5" />
//           </Button>
//         </div>
//       </div>

//       {/* mobile */}
//       <div className="px-4 pb-3 sm:hidden">
//         <SearchBar />
//       </div>
//       {open && (
//         <nav className="flex flex-col gap-1 border-t border-border px-4 pb-3 pt-2 lg:hidden">
//           {[...links, { to: "/admin", label: "Admin Dashboard" }].map((l) => (
//             <Link
//               key={l.to}
//               to={l.to}
//               onClick={() => setOpen(false)}
//               className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
//             >
//               {l.label}
//             </Link>
//           ))}
//           {!isAuthenticated && (
//             <div className="mt-2 flex gap-2 border-t border-border pt-3">
//               <Button asChild variant="outline" size="sm" className="flex-1 border-[#232F3E] text-[#131921]" onClick={() => setOpen(false)}>
//                 <Link to="/login">Login</Link>
//               </Button>
//               <Button asChild size="sm" className="flex-1 bg-[#FF9900] text-[#111111] hover:bg-[#E68A00]" onClick={() => setOpen(false)}>
//                 <Link to="/signup">Sign Up</Link>
//               </Button>
//             </div>
//           )}
//         </nav>
//       )}
//     </header>
//   );
// }
