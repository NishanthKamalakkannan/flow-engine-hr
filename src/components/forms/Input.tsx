import type { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-[#080C14] border border-[#1F2937] rounded-xl px-4 py-3 text-[#F9FAFB] text-sm font-semibold placeholder:text-[#6B7280]/40 focus:outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 transition-all shadow-inner ${props.className || ""}`}
    />
  );
}
