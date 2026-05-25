import { useState, useEffect } from "react";
import { ALL_PLATES } from "../lib/constants";

interface Props {
  plateInventory: Record<number, number>;
  onChange: (weight: number, count: number) => void;
}

function PlateCountInput({
  weight,
  count,
  onChange,
}: {
  weight: number;
  count: number;
  onChange: (weight: number, count: number) => void;
}) {
  const [value, setValue] = useState(String(count));

  useEffect(() => {
    setValue(String(count));
  }, [count]);

  return (
    <input
      type="number"
      value={value}
      onChange={(e) => {
        const raw = e.target.value;
        setValue(raw);
        if (raw === "") return;
        const n = Number(raw);
        if (!isNaN(n)) onChange(weight, Math.max(n, 0));
      }}
      className="w-14 h-7 text-center text-xs font-medium tabular-nums border border-gray-200 rounded bg-white text-gray-700 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      min={0}
      max={99}
    />
  );
}

export function PlateInventory({ plateInventory, onChange }: Props) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        Available Plates (each)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-3 max-w-sm md:max-w-none">
        {ALL_PLATES.map((weight) => {
          const count = plateInventory[weight] ?? 0;
          const active = count > 0;
          return (
            <div
              key={weight}
              className={`flex items-center gap-3 py-2 px-3 rounded-xl border-2 transition-all ${
                active
                  ? "bg-indigo-50 border-indigo-400"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <span
                className={`text-sm font-semibold w-12 text-right ${
                  active ? "text-indigo-700" : "text-gray-400"
                }`}
              >
                {weight}
                <span className="text-[10px] font-normal ml-0.5">kg</span>
              </span>
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={() => onChange(weight, count - 1)}
                  disabled={count === 0}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed leading-none"
                >
                  –
                </button>
                <PlateCountInput
                  weight={weight}
                  count={count}
                  onChange={onChange}
                />
                <button
                  onClick={() => onChange(weight, count + 1)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors leading-none"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
