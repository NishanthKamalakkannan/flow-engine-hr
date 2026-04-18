interface FieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}
export default function Field({ label, children, required }: FieldProps) {
  return (
    <div className="flex flex-col gap-2 mb-4 group">
      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] transition-colors group-focus-within:text-indigo-400">
        {label}{required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
