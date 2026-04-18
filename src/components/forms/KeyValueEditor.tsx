import { Plus, Trash2 } from "lucide-react";
import Input from "./Input";

interface KV { key: string; value: string; }
interface Props {
  pairs: KV[];
  onChange: (pairs: KV[]) => void;
}

export default function KeyValueEditor({ pairs, onChange }: Props) {
  const add = () => onChange([...pairs, { key: "", value: "" }]);
  const remove = (i: number) => onChange(pairs.filter((_, idx) => idx !== i));
  const update = (i: number, field: "key" | "value", val: string) => {
    const updated = [...pairs];
    updated[i] = { ...updated[i], [field]: val };
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3">
      {pairs.map((pair, i) => (
        <div key={i} className="flex gap-2 items-center group/kv animate-in slide-in-from-left-2 duration-300">
          <Input placeholder="key" value={pair.key} onChange={e => update(i, "key", e.target.value)} />
          <Input placeholder="value" value={pair.value} onChange={e => update(i, "value", e.target.value)} />
          <button 
            onClick={() => remove(i)} 
            className="text-slate-600 hover:text-rose-500 flex-shrink-0 p-1.5 hover:bg-rose-500/10 rounded-lg transition-all"
            title="Remove property"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button 
        onClick={add} 
        className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-800 bg-slate-900/40 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-indigo-300 hover:border-indigo-500/50 hover:bg-slate-800 transition-all active:scale-[0.98] mt-1"
      >
        <Plus size={14} /> Add Property
      </button>
    </div>
  );
}
