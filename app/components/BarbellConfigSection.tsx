interface Props {
  barbellWeight: number;
  onChange: (weight: number) => void;
}

export function BarbellConfigSection({ barbellWeight, onChange }: Props) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        Barbell Weight
      </h2>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={barbellWeight}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!isNaN(n)) onChange(n);
          }}
          className="w-20 px-2 py-1.5 text-center border border-gray-200 rounded-lg text-sm tabular-nums focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
          min={0}
          step={0.5}
        />
        <span className="text-sm text-gray-500">kg</span>
      </div>
    </section>
  );
}
