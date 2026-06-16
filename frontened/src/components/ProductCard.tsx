// import { Link } from "@tanstack/react-router";
// import { Heart, Plus, Star, Clock, Minus } from "lucide-react";
// import { useCart } from "@/context/CartContext";
// import { discountPercent, daysUntil, formatINR, type Product } from "@/lib/data";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// export default function ProductCard({ product }: { product: Product }) {
//   const { addToCart, wishlist, toggleWishlist, items, setQty } = useCart();
//   const off = discountPercent(product);
//   const days = daysUntil(product.expiryDate);
//   const inCart = items.find((i) => i.product.id === product.id);
//   const wished = wishlist.includes(product.id);

//   return (
//     <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#DDDDDD] bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
//       <button
//         onClick={() => toggleWishlist(product.id)}
//         aria-label="Wishlist"
//         className="absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/95 backdrop-blur transition-colors hover:bg-white"
//       >
//         <Heart className={cn("h-4 w-4", wished ? "fill-destructive text-destructive" : "text-muted-foreground")} />
//       </button>

//       {off > 0 && (
//         <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#FF9900] px-2 py-0.5 text-xs font-bold text-[#111111] shadow-soft">
//           {off}% OFF
//         </span>
//       )}

//       <Link
//         to="/product/$productId"
//         params={{ productId: product.id }}
//         className={cn("flex h-36 items-center justify-center bg-gradient-to-br text-6xl", product.gradient)}
//       >
//         <span className="transition-transform duration-300 group-hover:scale-110">{product.emoji}</span>
//       </Link>

//       <div className="flex flex-1 flex-col gap-1.5 p-3">
//         <div className="flex items-center gap-1 text-xs text-[#565959]">
//           <span className="rounded bg-[#EAEDED] px-1.5 py-0.5 font-medium text-[#111111]">{product.unit}</span>
//           <span className="flex items-center gap-0.5 text-amber-500">
//             <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {product.rating}
//           </span>
//         </div>

//         <Link to="/product/$productId" params={{ productId: product.id }} className="line-clamp-2 text-sm font-semibold leading-tight text-[#111111] hover:text-[#131921]">
//           {product.name}
//         </Link>

//         <div
//           className={cn(
//             "flex items-center gap-1 text-xs font-medium",
//             days <= 3 ? "text-[#B42318]" : days <= 7 ? "text-[#FF9900]" : "text-[#565959]",
//           )}
//         >
//           <Clock className="h-3 w-3" />
//           {days <= 0 ? "Expired" : days <= 7 ? `Expires in ${days}d` : `Best before ${product.expiryDate}`}
//         </div>

//         <div className="mt-auto flex items-end justify-between gap-2 pt-1">
//           <div className="leading-tight">
//             <span className="text-base font-bold text-[#111111]">{formatINR(product.price)}</span>
//             {off > 0 && <span className="ml-1 text-xs text-[#565959] line-through">{formatINR(product.mrp)}</span>}
//           </div>

//           {inCart ? (
//             <div className="flex items-center gap-1 rounded-lg bg-primary text-primary-foreground">
//               <button className="grid h-8 w-8 place-items-center" onClick={() => setQty(product.id, inCart.qty - 1)}>
//                 <Minus className="h-3.5 w-3.5" />
//               </button>
//               <span className="min-w-5 text-center text-sm font-bold">{inCart.qty}</span>
//               <button className="grid h-8 w-8 place-items-center" onClick={() => setQty(product.id, inCart.qty + 1)}>
//                 <Plus className="h-3.5 w-3.5" />
//               </button>
//             </div>
//           ) : (
//             <Button size="sm" className="h-8 gap-1 px-3" onClick={() => addToCart(product)}>
//               <Plus className="h-3.5 w-3.5" /> Add
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
