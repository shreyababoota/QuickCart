// import { AlertTriangle, Clock, TrendingDown } from "lucide-react";
// import { type Product, daysUntil, suggestedDiscount, formatINR } from "@/lib/data";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// type Variant = "low-stock" | "near-expiry";

// export default function InventoryAlert({
//   variant,
//   items,
//   threshold,
//   onApplyDiscount,
// }: {
//   variant: Variant;
//   items: Product[];
//   threshold?: number;
//   onApplyDiscount?: (p: Product) => void;
// }) {
//   const isLow = variant === "low-stock";

//   return (
//     <div
//       className={cn(
//         "rounded-2xl border p-4 shadow-soft",
//         isLow ? "border-destructive/30 bg-destructive/5" : "border-accent/30 bg-accent/5",
//       )}
//     >
//       <div className="mb-3 flex items-center gap-2">
//         <span
//           className={cn(
//             "grid h-9 w-9 place-items-center rounded-xl",
//             isLow ? "bg-destructive/15 text-destructive" : "bg-accent/15 text-accent",
//           )}
//         >
//           {isLow ? <AlertTriangle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
//         </span>
//         <div>
//           <h3 className="font-bold">{isLow ? "Low Stock Alert" : "Near Expiry Alert"}</h3>
//           <p className="text-xs text-muted-foreground">
//             {isLow ? `Stock below ${threshold ?? 20} units` : "Expiring within the next 7 days"}
//           </p>
//         </div>
//         <span
//           className={cn(
//             "ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold",
//             isLow ? "bg-destructive text-destructive-foreground" : "bg-accent text-accent-foreground",
//           )}
//         >
//           {items.length}
//         </span>
//       </div>

//       <div className="space-y-2">
//         {items.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">All good here ✨</p>}
//         {items.map((p) => {
//           const days = daysUntil(p.expiryDate);
//           const disc = suggestedDiscount(p.expiryDate);
//           return (
//             <div key={p.id} className="flex items-center gap-3 rounded-xl bg-card p-2.5">
//               <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-xl">{p.emoji}</span>
//               <div className="min-w-0 flex-1">
//                 <p className="truncate text-sm font-semibold">{p.name}</p>
//                 <p className="text-xs text-muted-foreground">
//                   {isLow ? `Only ${p.stock} left in stock` : `${days}d left · suggest ${disc}% off`}
//                 </p>
//               </div>
//               {isLow ? (
//                 <span className="text-sm font-bold text-destructive">{p.stock}</span>
//               ) : (
//                 <Button size="sm" variant="outline" className="gap-1" onClick={() => onApplyDiscount?.(p)}>
//                   <TrendingDown className="h-3.5 w-3.5" /> {disc}%
//                 </Button>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export { formatINR };
