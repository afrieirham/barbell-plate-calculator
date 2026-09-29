import { useState, useEffect } from "react";

interface Props {
  targetWeight: number;
  barbellWeight: number;
  maxWeight: number;
  prevWeight: number | null;
  nextWeight: number | null;
  onTargetChange: (weight: number) => void;
}

export function TargetWeightSection({
  targetWeight,
  barbellWeight,
  maxWeight,
  prevWeight,
  nextWeight,
  onTargetChange,
}: Props) {
  const [value, setValue] = useState(String(targetWeight));

  useEffect(() => {
    setValue(String(targetWeight));
  }, [targetWeight]);

  const formatWeight = (weight: number) => Number(weight.toFixed(2));

  const prevDelta = prevWeight !== null ? formatWeight(targetWeight - prevWeight) : null;
  const nextDelta = nextWeight !== null ? formatWeight(nextWeight - targetWeight) : null;

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        Target Weight
      </h2>
      <p className="text-5xl font-bold text-gray-900 tabular-nums">
        {targetWeight}
        <span className="text-2xl font-normal text-gray-400 ml-1">kg</span>
      </p>
      <p className="text-xs text-gray-400 -mt-1">
        Max weight: {maxWeight} kg
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => prevWeight !== null && onTargetChange(prevWeight)}
          disabled={prevWeight === null}
          className="w-24 shrink-0 whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium tabular-nums text-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {prevDelta !== null ? `– ${prevDelta} kg` : "–"}
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            setValue(raw);
            if (raw === "") return;
            const n = Number(raw);
            if (!isNaN(n)) onTargetChange(n);
          }}
          className="w-20 px-2 py-1.5 text-center border border-gray-200 rounded-lg text-sm tabular-nums focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
          min={barbellWeight}
          step={0.5}
        />
        <button
          onClick={() => nextWeight !== null && onTargetChange(nextWeight)}
          disabled={nextWeight === null}
          className="w-24 shrink-0 whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium tabular-nums text-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {nextDelta !== null ? `+ ${nextDelta} kg` : "+"}
        </button>
      </div>
      {targetWeight === barbellWeight && (
        <p className="text-sm text-amber-500">
          Add weight above barbell to calculate plates
        </p>
      )}
    </section>
  );
}
