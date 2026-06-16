// import { Link, useRouterState } from "@tanstack/react-router";
// import {
//   LayoutDashboard,
//   Users,
//   ShoppingBag,
//   Boxes,
//   Leaf,
//   Store,
//   X,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const items = [
//   { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
//   { to: "/admin/customers", label: "Customers", icon: Users },
//   { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
//   { to: "/admin/inventory", label: "Inventory", icon: Boxes },
//   { to: "/admin/sustainability", label: "Sustainability", icon: Leaf },
// ];

// export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
//   const pathname = useRouterState({ select: (s) => s.location.pathname });

//   return (
//     <>
//       {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
//       <aside
//         className={cn(
//           "fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0",
//           open ? "translate-x-0" : "-translate-x-full",
//         )}
//       >
//         <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
//           <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
//             <Leaf className="h-5 w-5" />
//           </span>
//           <div className="leading-tight">
//             <p className="font-extrabold tracking-tight">AmaCart</p>
//             <p className="text-xs text-muted-foreground">Admin Panel</p>
//           </div>
//           <button className="ml-auto lg:hidden" onClick={onClose} aria-label="Close">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <nav className="flex-1 space-y-1 p-3">
//           {items.map((it) => {
//             const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
//             return (
//               <Link
//                 key={it.to}
//                 to={it.to}
//                 onClick={onClose}
//                 className={cn(
//                   "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
//                   active
//                     ? "bg-gradient-primary text-primary-foreground shadow-soft"
//                     : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
//                 )}
//               >
//                 <it.icon className="h-4.5 w-4.5" />
//                 {it.label}
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="border-t border-sidebar-border p-3">
//           <Link
//             to="/"
//             className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
//           >
//             <Store className="h-4.5 w-4.5" /> Back to Store
//           </Link>
//         </div>
//       </aside>
//     </>
//   );
// }
