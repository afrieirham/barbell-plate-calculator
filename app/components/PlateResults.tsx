import { useState } from "react";
import { calculatePlates, type PlateAllocation } from "../lib/calculate-plates";
import { buildShareUrl } from "../lib/use-calculator-state";
import { PlateVisualization } from "./PlateVisualization";

interface Props {
  targetWeight: number;
  barbellWeight: number;
  plateInventory: Record<number, number>;
  inventoryOpen?: boolean;
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
  inventoryOpen,
}: Props) {
  const [copied, setCopied] = useState(false);
  const result = calculatePlates(targetWeight, barbellWeight, plateInventory);

  const handleCopyLink = async () => {
    try {
      const url = buildShareUrl({
        targetWeight,
        barbellWeight,
        plateInventory,
        inventoryOpen,
      });
      window.history.replaceState(null, "", url);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (targetWeight <= barbellWeight) {
    return (
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
          Results
        </h2>
        <div className="bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 rounded-xl p-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Set a target weight above the barbell to see the plate breakdown.
          </p>
        </div>
        <ShareButton copied={copied} onClick={handleCopyLink} />
      </section>
    );
  }

  if (!result || result.perSide.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
          Results
        </h2>
        <div className="bg-neutral-100 border border-neutral-300 dark:bg-neutral-900 dark:border-neutral-700 rounded-xl p-4">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            No plates are available to load. Enable some plates above.
          </p>
        </div>
        <ShareButton copied={copied} onClick={handleCopyLink} />
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
        Results
      </h2>

      <div className="bg-white border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 rounded-xl p-5 space-y-4">
        <div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wide font-medium mb-2">
            Per side
          </p>
          <PlateVisualization allocations={result.perSide} />
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
          <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wide font-medium mb-1">
            Total plates needed
          </p>
          <p className="text-base text-neutral-700 dark:text-neutral-300">
            {formatAllocation(result.perSide, 2)}
          </p>
        </div>

        {!result.exact && (
          <div className="bg-neutral-100 border border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 rounded-lg p-3">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Exact weight cannot be loaded with current plates. Closest match:{" "}
              <strong>{result.totalWeightAchieved} kg</strong> (short by{" "}
              {result.shortBy * 2} kg total).
            </p>
          </div>
        )}
      </div>

      <ShareButton copied={copied} onClick={handleCopyLink} />
    </section>
  );
}

function ShareButton({
  copied,
  onClick,
}: {
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg text-sm font-medium transition-colors"
    >
      {copied ? (
        <>
          <span className="text-neutral-700 dark:text-neutral-200">✓</span>{" "}
          Saved!
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
          Save Share Link
        </>
      )}
    </button>
  );
}
