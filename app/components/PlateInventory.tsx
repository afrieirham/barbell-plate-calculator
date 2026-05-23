import { ALL_PLATES } from "../lib/constants";

interface Props {
  selectedPlates: number[];
  onToggle: (weight: number) => void;
}

export function PlateInventory({ selectedPlates, onToggle }: Props) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        Available Plates
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {ALL_PLATES.map((weight) => {
          const active = selectedPlates.includes(weight);
          return (
            <button
              key={weight}
              onClick={() => onToggle(weight)}
              className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                active
                  ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                  : "bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200"
              }`}
            >
              {weight} kg
            </button>
          );
        })}
      </div>
    </section>
  );
}
