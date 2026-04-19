interface Props {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

export default function Field({ label, children, required }: Props) {
  return (
    <div className="flex flex-col gap-2.5 mb-5 animate-in fade-in slide-in-from-left-2 duration-400">
      <div className="flex items-center gap-2.5 px-1">
        <label className="text-[10px] text-[#6B7280] font-black uppercase tracking-[0.2em]">
          {label}
        </label>
        {required && <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] shadow-[0_0_8px_rgba(124,58,237,0.8)]" />}
      </div>
      <div className="group transition-all focus-within:translate-x-1">
        {children}
      </div>
    </div>
  );
}
