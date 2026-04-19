interface Props {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

export default function Field({ label, children, required }: Props) {
  return (
    <div className="flex flex-col gap-2 mb-4 animate-in fade-in slide-in-from-left-1 duration-300">
      <div className="flex items-center gap-2 px-1">
        <label className="text-[10px] text-pink-600/60 font-bold uppercase tracking-widest">
          {label}
        </label>
        {required && <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shadow-sm shadow-pink-500/50" />}
      </div>
      <div className="group transition-all focus-within:translate-x-0.5">
        {children}
      </div>
    </div>
  );
}
