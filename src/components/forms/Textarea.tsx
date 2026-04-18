interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export default function Textarea(props: TextareaProps) {
  return (
    <textarea
      {...props}
      rows={3}
      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600 font-medium resize-none shadow-inner"
    />
  );
}
