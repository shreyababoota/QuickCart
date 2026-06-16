export default function SocialLoginButton({ label, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-2 rounded border border-[#D5D9D9] bg-white px-4 py-2.5 text-sm font-medium text-[#111111] shadow-sm transition-colors hover:bg-[#F7F7F7]"
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </button>
  );
}
