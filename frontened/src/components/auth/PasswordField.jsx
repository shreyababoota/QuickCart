import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordField({ label, id, value, onChange, placeholder, error, autoComplete }) {
  const [show, setShow] = useState(false);

  return (
    <div className="block w-full">
      <label htmlFor={id} className="block text-sm font-semibold text-[#111111] mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded border border-[#CCCCCC] bg-white px-3 py-2 transition duration-150 focus-within:border-[#E77600] focus-within:ring-1 focus-within:ring-[#E77600] focus-within:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]">
        <Lock className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full border-0 bg-white text-sm text-[#111111] outline-none placeholder:text-slate-400 py-0.5"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
        </button>
      </div>
      {error ? <span className="mt-1 block text-xs text-rose-600 font-medium">{error}</span> : null}
    </div>
  );
}
