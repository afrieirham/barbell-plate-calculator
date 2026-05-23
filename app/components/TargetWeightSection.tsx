interface Props {
  targetWeight: number;
  barbellWeight: number;
  onTargetChange: (weight: number) => void;
  onAdjust: (delta: number) => void;
}

export function TargetWeightSection({
  targetWeight,
  barbellWeight,
  onTargetChange,
  onAdjust,
}: Props) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        Target Weight
      </h2>
      <p className="text-5xl font-bold text-gray-900 tabular-nums">
        {targetWeight}
        <span className="text-2xl font-normal text-gray-400 ml-1">kg</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onAdjust(-2.5)}
          disabled={targetWeight - 2.5 < barbellWeight}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          – 2.5 kg
        </button>
        <input
          type="number"
          value={targetWeight}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!isNaN(n)) onTargetChange(n);
          }}
          className="w-20 px-2 py-1.5 text-center border border-gray-200 rounded-lg text-sm tabular-nums focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
          min={barbellWeight}
          step={0.5}
        />
        <button
          onClick={() => onAdjust(2.5)}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          + 2.5 kg
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
