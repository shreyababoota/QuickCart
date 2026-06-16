export default function Button({ children, className = "", variant = "primary", ...props }) {
  const base = "inline-flex items-center justify-center rounded px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[#E77600] disabled:cursor-not-allowed disabled:opacity-60 shadow-sm border";
  
  const variants = {
    primary: "bg-[#FF9900] border-[#E68A00] text-[#111111] hover:bg-[#E68A00]",
    secondary: "bg-[#F0F2F2] border-[#D5D9D9] text-[#111111] hover:bg-[#E3E6E6]",
    ghost: "bg-transparent border-transparent text-slate-700 hover:bg-slate-100 shadow-none",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
