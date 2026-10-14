import { useState, useEffect } from "react";
import { ALL_PLATES } from "../lib/constants";

interface Props {
  barbellWeight: number;
  plateInventory: Record<number, number>;
  onBarbellChange: (weight: number) => void;
  onPlateChange: (weight: number, count: number) => void;
  open: boolean;
  onToggle: (open: boolean) => void;
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
      className="w-14 h-7 text-center text-xs font-medium tabular-nums border border-neutral-200 rounded bg-white text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:focus:border-neutral-100 dark:focus:ring-neutral-100 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      min={0}
      max={99}
    />
  );
}

export function EquipmentSection({
  barbellWeight,
  plateInventory,
  onBarbellChange,
  onPlateChange,
  open,
  onToggle,
}: Props) {
  const [barValue, setBarValue] = useState(String(barbellWeight));

  useEffect(() => {
    setBarValue(String(barbellWeight));
  }, [barbellWeight]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => onToggle(!open)}
        className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest cursor-pointer flex items-center gap-2 select-none w-full text-left"
      >
        Barbell &amp; Plates
        <svg
          className="w-3.5 h-3.5 ml-auto transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: open ? "1200px" : "0" }}
      >
        <div className="space-y-5 pt-1">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Barbell Weight
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={barValue}
                onChange={(e) => {
                  const raw = e.target.value;
                  setBarValue(raw);
                  if (raw === "") return;
                  const n = Number(raw);
                  if (!isNaN(n)) onBarbellChange(n);
                }}
                className="w-20 px-2 py-1.5 text-center border border-neutral-200 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 rounded-lg text-sm tabular-nums focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:focus:border-neutral-100 dark:focus:ring-neutral-100 outline-none"
                min={0}
                step={0.5}
              />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                kg
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Available Plates (pairs)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-3 max-w-sm md:max-w-none">
              {ALL_PLATES.map((weight) => {
                const count = plateInventory[weight] ?? 0;
                const active = count > 0;
                return (
                  <div
                    key={weight}
                    className={`flex items-center gap-3 py-2 px-3 rounded-xl border-2 transition-all ${
                      active
                        ? "bg-white border-neutral-900 dark:bg-neutral-900 dark:border-white"
                        : "bg-neutral-50 border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold w-12 text-right ${
                        active
                          ? "text-neutral-900 dark:text-white"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    >
                      {weight}
                      <span className="text-[10px] font-normal ml-0.5">kg</span>
                    </span>
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => onPlateChange(weight, count - 1)}
                        disabled={count === 0}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed leading-none"
                      >
                        –
                      </button>
                      <PlateCountInput
                        weight={weight}
                        count={count}
                        onChange={onPlateChange}
                      />
                      <button
                        onClick={() => onPlateChange(weight, count + 1)}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors leading-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
