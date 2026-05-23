import { useState } from "react";
import { calculatePlates, type PlateAllocation } from "../lib/calculate-plates";
import { buildShareUrl } from "../lib/use-calculator-state";

interface Props {
  targetWeight: number;
  barbellWeight: number;
  plateInventory: Record<number, number>;
}

function formatAllocation(items: PlateAllocation[], multiplier: number) {
  return items
    .filter((p) => p.countPerSide > 0)
    .map((p) => `${p.countPerSide * multiplier}× ${p.weight} kg`)
    .join(", ");
}

export function PlateResults({
  targetWeight,
  barbellWeight,
  plateInventory,
}: Props) {
  const [copied, setCopied] = useState(false);
  const result = calculatePlates(targetWeight, barbellWeight, plateInventory);

  const handleCopyLink = async () => {
    try {
      const url = buildShareUrl({ targetWeight, barbellWeight, plateInventory });
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (targetWeight <= barbellWeight) {
    return (
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Results
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Set a target weight above the barbell to see the plate breakdown.
          </p>
        </div>
      </section>
    );
  }

  if (!result || result.perSide.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Results
        </h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-700">
            No plates are available to load. Enable some plates above.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        Results
      </h2>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
            Load on each side
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {formatAllocation(result.perSide, 1)}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
            Total plates needed
          </p>
          <p className="text-base text-gray-700">
            {formatAllocation(result.perSide, 2)}
          </p>
        </div>

        {!result.exact && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-700">
              Exact weight cannot be loaded with current plates. Closest match:{" "}
              <strong>{result.totalWeightAchieved} kg</strong> (short by{" "}
              {result.shortBy * 2} kg total).
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors"
      >
        {copied ? (
          <>
            <span className="text-green-600">✓</span> Link copied!
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            Copy Share Link
          </>
        )}
      </button>
    </section>
  );
}
