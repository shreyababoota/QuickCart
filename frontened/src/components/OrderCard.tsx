// import { Link } from "@tanstack/react-router";
// import { type Order, type OrderStatus, formatINR } from "@/lib/data";
// import { Button } from "@/components/ui/button";
// import { RotateCcw, Eye } from "lucide-react";
// import { useCart } from "@/context/CartContext";
// import { products } from "@/lib/data";
// import { cn } from "@/lib/utils";

// const statusStyles: Record<OrderStatus, string> = {
//   Pending: "bg-muted text-muted-foreground",
//   Approved: "bg-accent/15 text-accent",
//   Dispatched: "bg-chart-4/15 text-chart-4",
//   Delivered: "bg-primary/15 text-primary",
//   Cancelled: "bg-destructive/15 text-destructive",
// };

// export function StatusBadge({ status }: { status: OrderStatus }) {
//   return (
//     <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyles[status])}>
//       {status}
//     </span>
//   );
// }

// export default function OrderCard({ order }: { order: Order }) {
//   const { addToCart } = useCart();

//   const reorder = () => {
//     order.items.forEach((it) => {
//       const p = products.find((x) => x.name === it.name);
//       if (p) addToCart(p, it.qty);
//     });
//   };

//   return (
//     <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
//       <div className="flex flex-wrap items-center justify-between gap-2">
//         <div className="min-w-0">
//           <p className="font-bold">{order.id}</p>
//           <p className="text-xs text-muted-foreground">Ordered on {order.date}</p>
//         </div>
//         <StatusBadge status={order.status} />
//       </div>

//       <div className="my-3 flex flex-wrap gap-2">
//         {order.items.map((it, i) => (
//           <span key={i} className="flex items-center gap-1.5 rounded-lg bg-secondary px-2 py-1 text-xs font-medium">
//             <span className="text-base">{it.emoji}</span> {it.name} ×{it.qty}
//           </span>
//         ))}
//       </div>

//       <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
//         <p className="text-sm">
//           Total <span className="text-base font-bold">{formatINR(order.total)}</span>
//         </p>
//         <div className="flex gap-2">
//           <Button asChild variant="outline" size="sm" className="gap-1">
//             <Link to="/orders">
//               <Eye className="h-3.5 w-3.5" /> View
//             </Link>
//           </Button>
//           <Button size="sm" className="gap-1" onClick={reorder}>
//             <RotateCcw className="h-3.5 w-3.5" /> Reorder
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
