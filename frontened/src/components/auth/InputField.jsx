export default function InputField({ label, id, type = "text", value, onChange, placeholder, error, autoComplete, icon, required }) {
  return (
    <div className="block w-full">
      <label htmlFor={id} className="block text-sm font-semibold text-[#111111] mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="flex items-center gap-2 rounded border border-[#CCCCCC] bg-white px-3 py-2 transition duration-150 focus-within:border-[#E77600] focus-within:ring-1 focus-within:ring-[#E77600] focus-within:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]">
        {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full border-0 bg-white text-sm text-[#111111] outline-none placeholder:text-slate-400 py-0.5"
        />
      </div>
      {error ? <span className="mt-1 block text-xs text-rose-600 font-medium">{error}</span> : null}
    </div>
  );
}
