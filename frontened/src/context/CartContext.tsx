// import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
// import { toast } from "sonner";
// import { products as catalog, type Product } from "@/lib/data";

// export type CartItem = { product: Product; qty: number };

// type CartContextValue = {
//   items: CartItem[];
//   wishlist: string[];
//   wishlistCount: number;
//   addToCart: (product: Product, qty?: number) => void;
//   addToWishlist: (product: Product | string) => void;
//   removeFromCart: (id: string) => void;
//   removeFromWishlist: (id: string) => void;
//   setQty: (id: string, qty: number) => void;
//   clearCart: () => void;
//   toggleWishlist: (productOrId: Product | string) => void;
//   isInWishlist: (id: string) => boolean;
//   count: number;
//   subtotal: number;
//   coupon: { code: string; percent: number } | null;
//   applyCoupon: (code: string) => boolean;
//   removeCoupon: () => void;
// };

// const CartContext = createContext<CartContextValue | null>(null);

// const COUPONS: Record<string, number> = { FRESH10: 10, GREEN20: 20, SAVE15: 15 };

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [items, setItems] = useState<CartItem[]>([]);
//   const [wishlist, setWishlist] = useState<string[]>([]);
//   const [coupon, setCoupon] = useState<{ code: string; percent: number } | null>(null);

//   // hydrate from localStorage (client only)
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     try {
//       const raw = localStorage.getItem("amacart-cart");
//       if (raw) {
//         const parsed = JSON.parse(raw) as { ids?: { id: string; qty: number }[]; wishlist?: string[] };
//         const ids = Array.isArray(parsed.ids) ? parsed.ids : [];
//         const restored = ids
//           .map(({ id, qty }) => {
//             const product = catalog.find((p) => p.id === id);
//             return product ? { product, qty } : null;
//           })
//           .filter(Boolean) as CartItem[];
//         setItems(restored);
//         setWishlist(Array.isArray(parsed.wishlist) ? parsed.wishlist : []);
//       }
//     } catch {
//       /* ignore */
//     }
//   }, []);

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     localStorage.setItem(
//       "amacart-cart",
//       JSON.stringify({ ids: items.map((i) => ({ id: i.product.id, qty: i.qty })), wishlist }),
//     );
//   }, [items, wishlist]);

//   const addToCart = (product: Product, qty = 1) => {
//     setItems((prev) => {
//       const found = prev.find((i) => i.product.id === product.id);
//       if (found) return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + qty } : i));
//       return [...prev, { product, qty }];
//     });
//     toast.success(`${product.name} added to cart`);
//   };

//   const removeFromCart = (id: string) => setItems((prev) => prev.filter((i) => i.product.id !== id));

//   const setQty = (id: string, qty: number) =>
//     setItems((prev) =>
//       qty <= 0 ? prev.filter((i) => i.product.id !== id) : prev.map((i) => (i.product.id === id ? { ...i, qty } : i)),
//     );

//   const clearCart = () => {
//     setItems([]);
//     setCoupon(null);
//   };

//   const addToWishlist = (product: Product | string) => {
//     const id = typeof product === "string" ? product : product.id;
//     setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id]));
//     toast.success(`${typeof product === "string" ? "Item" : product.name} added to wishlist ❤️`);
//   };

//   const removeFromWishlist = (id: string) => {
//     setWishlist((prev) => prev.filter((itemId) => itemId !== id));
//     toast("Removed from wishlist");
//   };

//   const toggleWishlist = (productOrId: Product | string) => {
//     const id = typeof productOrId === "string" ? productOrId : productOrId.id;
//     setWishlist((prev) => {
//       const exists = prev.includes(id);
//       if (exists) {
//         toast("Removed from wishlist");
//         return prev.filter((itemId) => itemId !== id);
//       }
//       toast.success(`${typeof productOrId === "string" ? "Item" : productOrId.name} added to wishlist ❤️`);
//       return [...prev, id];
//     });
//   };

//   const isInWishlist = (id: string) => wishlist.includes(id);

//   const applyCoupon = (code: string) => {
//     const percent = COUPONS[code.trim().toUpperCase()];
//     if (percent) {
//       setCoupon({ code: code.trim().toUpperCase(), percent });
//       toast.success(`Coupon applied — ${percent}% off`);
//       return true;
//     }
//     toast.error("Invalid coupon code");
//     return false;
//   };

//   const removeCoupon = () => setCoupon(null);

//   const value = useMemo<CartContextValue>(() => {
//     const count = items.reduce((s, i) => s + i.qty, 0);
//     const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
//     return {
//       items,
//       wishlist,
//       wishlistCount: wishlist.length,
//       addToCart,
//       addToWishlist,
//       removeFromCart,
//       removeFromWishlist,
//       setQty,
//       clearCart,
//       toggleWishlist,
//       isInWishlist,
//       count,
//       subtotal,
//       coupon,
//       applyCoupon,
//       removeCoupon,
//     };
//   }, [items, wishlist, coupon]);

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// }

// export function useCart() {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used within CartProvider");
//   return ctx;
// }
