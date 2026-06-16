import { AlertTriangle } from "lucide-react";

export default function FormError({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded border border-[#C40000] bg-[#FFF8F8] px-3 py-2.5 text-sm text-[#C40000]">
      <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
      <div className="leading-snug">
        <h4 className="font-semibold text-sm">There was a problem</h4>
        <p className="text-xs mt-0.5 text-[#111111]">{message}</p>
      </div>
    </div>
  );
}
