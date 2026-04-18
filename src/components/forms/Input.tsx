interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export default function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600 font-medium"
    />
  );
}
