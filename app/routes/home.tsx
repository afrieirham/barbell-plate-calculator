import type { Route } from "./+types/home";
import { useCalculatorState } from "../lib/use-calculator-state";
import { TargetWeightSection } from "../components/TargetWeightSection";
import { BarbellConfigSection } from "../components/BarbellConfigSection";
import { PlateInventory } from "../components/PlateInventory";
import { PlateResults } from "../components/PlateResults";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Barbell Plate Calculator" },
    {
      name: "description",
      content:
        "Calculate how to load a barbell to reach your target weight.",
    },
  ];
}

export default function Home() {
  const {
    targetWeight,
    barbellWeight,
    selectedPlates,
    setTargetWeight,
    setBarbellWeight,
    togglePlate,
    adjustTargetWeight,
  } = useCalculatorState();

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-10">
      <header>
        <h1 className="text-lg font-bold text-gray-900">
          Barbell Plate Calculator
        </h1>
      </header>

      <TargetWeightSection
        targetWeight={targetWeight}
        barbellWeight={barbellWeight}
        onTargetChange={setTargetWeight}
        onAdjust={adjustTargetWeight}
      />

      <BarbellConfigSection
        barbellWeight={barbellWeight}
        onChange={setBarbellWeight}
      />

      <PlateInventory
        selectedPlates={selectedPlates}
        onToggle={togglePlate}
      />

      <PlateResults
        targetWeight={targetWeight}
        barbellWeight={barbellWeight}
        selectedPlates={selectedPlates}
      />
    </div>
  );
}
