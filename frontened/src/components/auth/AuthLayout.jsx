import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export default function AuthLayout({ title, subtitle, children, footerText, footerLink, footerHref }) {
  return (
    <main className="min-h-screen bg-[#EAEDED] flex flex-col items-center justify-center px-4 py-10 text-[#111111]">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Amazon-style Logo */}
        <Link to="/" className="flex items-center gap-2 mb-6 group">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#131921] text-white shadow-md group-hover:bg-[#232F3E] transition-colors">
            <Leaf className="h-6 w-6 text-[#FF9900]" />
          </span>
          <span className="text-2xl font-black tracking-tight text-[#131921]">
            Ama<span className="text-[#FF9900]">Cart</span>
          </span>
        </Link>

        {/* Form Container */}
        <section className="w-full rounded-lg border border-[#DDDDDD] bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-medium mb-1 text-[#111111]">{title}</h1>
          {subtitle && <p className="text-sm text-slate-600 mb-6">{subtitle}</p>}
          
          {children}
        </section>

        {/* Footer Link Container */}
        {footerText && (
          <div className="w-full mt-6 text-center">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#DDDDDD]"></div>
              <span className="flex-shrink mx-4 text-xs text-slate-500">New to AmaCart?</span>
              <div className="flex-grow border-t border-[#DDDDDD]"></div>
            </div>
            <Link
              to={footerHref}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#DDDDDD] bg-white px-4 py-2 text-sm font-medium text-[#111111] hover:bg-[#F7F7F7] shadow-sm transition-colors border-b-2"
            >
              {footerLink}
            </Link>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-slate-500 space-x-4">
          <a href="#" className="hover:underline hover:text-[#FF9900]">Conditions of Use</a>
          <a href="#" className="hover:underline hover:text-[#FF9900]">Privacy Notice</a>
          <a href="#" className="hover:underline hover:text-[#FF9900]">Help</a>
        </div>
        <p className="mt-4 text-[10px] text-slate-400">© 2026, AmaCart.com, Inc. or its affiliates</p>
      </div>
    </main>
  );
}
