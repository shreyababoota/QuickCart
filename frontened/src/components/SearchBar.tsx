// import { useNavigate } from "@tanstack/react-router";
// import { Search, X } from "lucide-react";
// import { useMemo, useRef, useState } from "react";
// import { products, formatINR } from "@/lib/data";

// export default function SearchBar() {
//   const [q, setQ] = useState("");
//   const [focused, setFocused] = useState(false);
//   const navigate = useNavigate();
//   const boxRef = useRef<HTMLDivElement>(null);

//   const matches = useMemo(() => {
//     if (!q.trim()) return [];
//     const t = q.toLowerCase();
//     return products.filter((p) => p.name.toLowerCase().includes(t)).slice(0, 6);
//   }, [q]);

//   return (
//     <div ref={boxRef} className="relative w-full">
//       <div className="flex items-center gap-2 rounded-[8px] border border-[#D5D9D9] bg-white px-3 shadow-soft transition-all duration-300 focus-within:border-[#FF9900] focus-within:ring-2 focus-within:ring-[#FF9900]/25 h-10 w-full">
//         {/* Centered Search Icon */}
//         <div className="flex h-full items-center justify-center shrink-0">
//           <Search className="h-4.5 w-4.5 text-[#565959]" />
//         </div>
        
//         {/* Vertically and Horizontally Centered Input */}
//         <input
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setTimeout(() => setFocused(false), 150)}
//           placeholder="Search electronics, fashion, home essentials…"
//           className="flex-1 h-full bg-transparent text-sm text-[#111111] text-center placeholder:text-center outline-none placeholder:text-slate-400 min-w-0 py-0 leading-none"
//         />

//         {q && (
//           <div className="flex h-full items-center justify-center shrink-0">
//             <button
//               onClick={() => setQ("")}
//               aria-label="Clear"
//               className="rounded-md p-1 text-[#565959] hover:bg-[#EAEDED] hover:text-[#111111] transition-colors"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         )}
        
//         <div className="flex h-full items-center justify-center shrink-0">
//           <button
//             type="button"
//             onClick={() => navigate({ to: "/" })}
//             className="hidden h-8 items-center justify-center rounded-[4px] bg-[#FF9900] px-4 text-xs font-semibold text-[#111111] border border-[#E68A00] transition-colors hover:bg-[#E68A00] sm:inline-flex"
//           >
//             Search
//           </button>
//         </div>
//       </div>

//       {focused && matches.length > 0 && (
//         <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[8px] border border-[#DDDDDD] bg-white shadow-card">
//           {matches.map((p) => (
//             <button
//               key={p.id}
//               onMouseDown={() => navigate({ to: "/product/$productId", params: { productId: p.id } })}
//               className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#EAEDED]"
//             >
//               <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#EAEDED] text-lg">{p.emoji}</span>
//               <span className="flex-1 text-sm font-medium text-[#111111]">{p.name}</span>
//               <span className="text-sm font-semibold text-[#131921]">{formatINR(p.price)}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
