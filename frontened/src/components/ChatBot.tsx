// import { useEffect, useRef, useState } from "react";
// import { Send, Sparkles, Bot, User as UserIcon, ShoppingBag } from "lucide-react";
// import { Link } from "@tanstack/react-router";
// import { Button } from "@/components/ui/button";
// import { products, formatINR, type Product } from "@/lib/data";
// import { useCart } from "@/context/CartContext";
// import { cn } from "@/lib/utils";

// type Msg = { role: "user" | "ai"; text: string; picks?: Product[] };

// const suggestions = [
//   "Suggest healthy snacks",
//   "What should I buy for a Goa trip under ₹1500?",
//   "Recommend products based on my previous orders",
//   "Build me a weekly essentials list",
// ];

// function generateReply(input: string): Msg {
//   const t = input.toLowerCase();
//   if (t.includes("healthy") || t.includes("snack")) {
//     const picks = products.filter((p) => ["p9", "p6", "p8", "p13"].includes(p.id));
//     return { role: "ai", text: "Here are some wholesome picks — high on nutrition, low on guilt. Almonds and green tea are great metabolism boosters! 🌱", picks };
//   }
//   if (t.includes("goa") || t.includes("trip")) {
//     const picks = products.filter((p) => ["p5", "p7", "p15", "p6", "p9"].includes(p.id));
//     const total = picks.reduce((s, p) => s + p.price, 0);
//     return { role: "ai", text: `Packed a travel-friendly combo for your Goa trip — snacks, juices & hydration. Estimated total ${formatINR(total)}, well under ₹1500! 🏖️`, picks };
//   }
//   if (t.includes("previous") || t.includes("order") || t.includes("recommend")) {
//     const picks = products.filter((p) => ["p1", "p3", "p14", "p2"].includes(p.id));
//     return { role: "ai", text: "Based on your past orders you usually restock fresh staples. Here's your smart re-order list 🛒", picks };
//   }
//   if (t.includes("weekly") || t.includes("essential") || t.includes("list")) {
//     const picks = products.filter((p) => ["p3", "p4", "p2", "p16", "p10", "p1"].includes(p.id));
//     return { role: "ai", text: "Your weekly essentials are ready. I noticed you're missing eggs & cooking oil — want me to add suggestions? 📝", picks };
//   }
//   const picks = products.filter((p) => p.featured).slice(0, 4);
//   return { role: "ai", text: "Great question! Here are some trending products our shoppers love right now. Tell me your budget or a craving and I'll tailor a list ✨", picks };
// }

// export default function ChatBot() {
//   const { addToCart } = useCart();
//   const [messages, setMessages] = useState<Msg[]>([
//     { role: "ai", text: "Hi! I'm your AI Shopping Assistant 🤖 I can build smart lists, find deals, and suggest products. What are you shopping for today?" },
//   ]);
//   const [input, setInput] = useState("");
//   const [typing, setTyping] = useState(false);
//   const endRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, typing]);

//   const send = (text: string) => {
//     const value = text.trim();
//     if (!value) return;
//     setMessages((m) => [...m, { role: "user", text: value }]);
//     setInput("");
//     setTyping(true);
//     setTimeout(() => {
//       setMessages((m) => [...m, generateReply(value)]);
//       setTyping(false);
//     }, 800);
//   };

//   return (
//     <div className="flex h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-2xl border border-[#DDDDDD] bg-[#EAEDED] shadow-card">
//       <div className="flex items-center gap-3 border-b border-[#131921] bg-[#131921] p-4 text-white">
//         <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
//           <Bot className="h-5 w-5 text-white" />
//         </span>
//         <div>
//           <h2 className="font-bold leading-tight text-white">AI Shopping Assistant</h2>
//           <p className="flex items-center gap-1 text-xs text-slate-300">
//             <span className="h-2 w-2 rounded-full bg-emerald-300" /> Your Smart Shopping Companion
//           </p>
//         </div>
//         <Sparkles className="ml-auto h-5 w-5 opacity-80 text-white" />
//       </div>

//       <div className="flex-1 space-y-4 overflow-y-auto p-4 scroll-smooth">
//         {messages.map((m, i) => (
//           <div key={i} className={cn("flex gap-2.5 items-start", m.role === "user" && "flex-row-reverse")}>
//             <span
//               className={cn(
//                 "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full",
//                 m.role === "ai" ? "bg-[#131921] text-white" : "bg-[#FF9900] text-[#111111]",
//               )}
//             >
//               {m.role === "ai" ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
//             </span>
//             <div className={cn("max-w-[80%] space-y-2", m.role === "user" && "items-end")}>
//               <div
//                 className={cn(
//                   "rounded-2xl px-4 py-3 text-sm shadow-soft",
//                   m.role === "ai"
//                     ? "bg-[#131921] text-white"
//                     : "bg-[#FF9900] text-[#111111]",
//                 )}
//                 style={{ borderRadius: 14 }}
//               >
//                 {m.text}
//               </div>
//               {m.picks && (
//                 <div className="grid grid-cols-2 gap-2">
//                   {m.picks.map((p) => (
//                     <div key={p.id} className="rounded-xl border border-border bg-background p-2">
//                       <div className="flex items-center gap-2">
//                         <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#EAEDED] text-lg">{p.emoji}</span>
//                         <div className="min-w-0 flex-1">
//                           <Link
//                             to="/product/$productId"
//                             params={{ productId: p.id }}
//                             className="block truncate text-xs font-semibold hover:text-primary"
//                           >
//                             {p.name}
//                           </Link>
//                           <span className="text-xs font-bold text-[#131921]">{formatINR(p.price)}</span>
//                         </div>
//                       </div>
//                       <Button size="sm" variant="outline" className="mt-2 h-7 w-full gap-1 text-xs" onClick={() => addToCart(p)}>
//                         <ShoppingBag className="h-3 w-3" /> Add
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//         {typing && (
//           <div className="flex gap-2.5 items-start">
//             <span className="grid h-8 w-8 place-items-center rounded-full bg-[#131921] text-white">
//               <Bot className="h-4 w-4" />
//             </span>
//             <div className="flex items-center gap-1 rounded-2xl bg-[#131921] px-4 py-3 text-white shadow-soft">
//               <span className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:-0.3s]" />
//               <span className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:-0.15s]" />
//               <span className="h-2 w-2 animate-bounce rounded-full bg-white/60" />
//             </div>
//           </div>
//         )}
//         <div ref={endRef} />
//       </div>

//       <div className="border-t border-[#DDDDDD] p-3">
//         <div className="mb-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
//           {suggestions.map((s) => (
//             <button
//               key={s}
//               onClick={() => send(s)}
//               className="shrink-0 rounded-full border border-[#DDDDDD] bg-white px-3 py-1.5 text-xs font-medium text-[#565959] transition-colors hover:bg-[#FF9900] hover:text-[#111111]"
//             >
//               {s}
//             </button>
//           ))}
//         </div>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             send(input);
//           }}
//           className="flex items-center gap-2 rounded-xl border border-[#DDDDDD] bg-white px-3 py-2"
//         >
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask me anything…"
//             className="flex-1 bg-white text-[#111111] text-sm outline-none placeholder:text-[#565959]"
//             style={{ caretColor: "#131921" }}
//           />
//           <Button type="submit" size="icon" className="h-8 w-8 shrink-0 bg-[#FF9900] text-[#111111] hover:bg-[#E68A00]">
//             <Send className="h-4 w-4" />
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }
