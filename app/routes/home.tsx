import { useMemo } from "react";
import type { Route } from "./+types/home";
import { useCalculatorState } from "../lib/use-calculator-state";
import {
  calculateMaxWeight,
  calculateLoadableWeights,
} from "../lib/calculate-plates";
import { TargetWeightSection } from "../components/TargetWeightSection";
import { BarbellConfigSection } from "../components/BarbellConfigSection";
import { PlateInventory } from "../components/PlateInventory";
import { PlateResults } from "../components/PlateResults";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Barbell Plate Calculator" },
    {
      name: "description",
      content: "Calculate how to load a barbell to reach your target weight.",
    },
  ];
}

export default function Home() {
  const {
    targetWeight,
    barbellWeight,
    plateInventory,
    inventoryOpen,
    setTargetWeight,
    setBarbellWeight,
    setPlateCount,
    setInventoryOpen,
  } = useCalculatorState();

  const maxWeight = calculateMaxWeight(barbellWeight, plateInventory);

  const loadableWeights = useMemo(
    () => calculateLoadableWeights(barbellWeight, plateInventory),
    [barbellWeight, plateInventory]
  );

  const targetG = Math.round(targetWeight * 1000);
  const nextWeight =
    loadableWeights.find((w) => Math.round(w * 1000) > targetG) ?? null;
  const prevWeight =
    [...loadableWeights].reverse().find((w) => Math.round(w * 1000) < targetG) ??
    null;

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <header>
        <h1 className="text-lg font-bold text-gray-900">
          Barbell Plate Calculator
        </h1>
      </header>

      <TargetWeightSection
        targetWeight={targetWeight}
        barbellWeight={barbellWeight}
        maxWeight={maxWeight}
        prevWeight={prevWeight}
        nextWeight={nextWeight}
        onTargetChange={setTargetWeight}
      />

      <BarbellConfigSection
        barbellWeight={barbellWeight}
        onChange={setBarbellWeight}
      />

      <PlateInventory
        plateInventory={plateInventory}
        onChange={setPlateCount}
        open={inventoryOpen}
        onToggle={setInventoryOpen}
      />

      <PlateResults
        targetWeight={targetWeight}
        barbellWeight={barbellWeight}
        plateInventory={plateInventory}
        inventoryOpen={inventoryOpen}
      />
    </div>
  );
}
