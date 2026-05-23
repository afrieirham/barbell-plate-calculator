import { ALL_PLATES } from "../lib/constants";

interface Props {
  plateInventory: Record<number, number>;
  onChange: (weight: number, count: number) => void;
}

export function PlateInventory({ plateInventory, onChange }: Props) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        Available Plates (each)
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {ALL_PLATES.map((weight) => {
          const count = plateInventory[weight] ?? 0;
          const active = count > 0;
          return (
            <div
              key={weight}
              className={`flex items-center gap-1 py-2 px-2 rounded-xl border-2 transition-all ${
                active
                  ? "bg-indigo-50 border-indigo-400"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <span
                className={`text-sm font-semibold min-w-[3ch] text-center ${
                  active ? "text-indigo-700" : "text-gray-400"
                }`}
              >
                {weight}
                <span className="text-[10px] font-normal ml-0.5">kg</span>
              </span>
              <input
                type="number"
                value={count}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (!isNaN(n)) onChange(weight, Math.max(n, 0));
                }}
                className="w-10 h-7 text-center text-xs font-medium tabular-nums border border-gray-200 rounded bg-white text-gray-700 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ml-auto"
                min={0}
                max={99}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
