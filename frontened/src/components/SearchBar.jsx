import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { formatINR } from "@/lib/data";
import { useProducts } from "@/hooks/useProducts";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef(null);
  const { products } = useProducts();

  const matches = useMemo(() => {
    if (!q.trim()) return [];
    const t = q.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(t)).slice(0, 6);
  }, [q, products]);

  const handleSearch = () => {
    if (matches.length > 0) {
      navigate(`/product/${matches[0].id}`);
    }
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="flex h-10 w-full items-stretch overflow-hidden rounded-lg border border-[#DDDDDD] bg-white shadow-soft transition-all focus-within:border-[#FF9900] focus-within:ring-2 focus-within:ring-[#FF9900]/25">
        <div className="flex items-center pl-3">
          <Search className="h-4 w-4 text-[#565959]" />
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search electronics, fashion, home essentials…"
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[#111111] outline-none placeholder:text-[#565959]"
        />

        {q && (
          <button
            onClick={() => setQ("")}
            aria-label="Clear"
            className="flex items-center px-2 text-[#565959] transition-colors hover:text-[#111111]"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={handleSearch}
          className="flex items-center bg-[#FF9900] px-4 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#E68A00]"
        >
          <Search className="mr-1.5 h-4 w-4 sm:hidden" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {focused && matches.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-[#DDDDDD] bg-white shadow-card">
          {matches.map((p) => (
            <button
              key={p.id}
              onMouseDown={() => navigate(`/product/${p.id}`)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#EAEDED]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-md bg-[#EAEDED] text-lg">{p.emoji}</span>
              <span className="flex-1 text-sm font-medium text-[#111111]">{p.name}</span>
              <span className="text-sm font-semibold text-[#111111]">{formatINR(p.price)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
