import type { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-white border border-pink-100 rounded-xl px-4 py-2.5 text-[#4A0E1C] text-sm font-medium placeholder:text-pink-600/20 focus:outline-none focus:border-[#FF4D6D] focus:ring-4 focus:ring-pink-500/5 transition-all shadow-sm ${props.className || ""}`}
    />
  );
}
