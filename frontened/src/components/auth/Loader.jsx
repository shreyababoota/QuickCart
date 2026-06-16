export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded border border-[#FF9900]/30 bg-[#FFF9E6] px-3 py-2.5 text-sm font-medium text-[#111111]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#FF9900] border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
