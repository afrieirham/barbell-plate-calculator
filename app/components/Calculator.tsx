import { useMemo } from "react";
import { useCalculatorState } from "../lib/use-calculator-state";
import {
  calculateMaxWeight,
  calculateLoadableWeights,
} from "../lib/calculate-plates";
import { TargetWeightSection } from "./TargetWeightSection";
import { BarbellConfigSection } from "./BarbellConfigSection";
import { PlateInventory } from "./PlateInventory";
import { PlateResults } from "./PlateResults";
import type { CalculatorDefaults } from "../lib/constants";

export function Calculator({ defaults }: { defaults: CalculatorDefaults }) {
  const {
    targetWeight,
    barbellWeight,
    plateInventory,
    inventoryOpen,
    setTargetWeight,
    setBarbellWeight,
    setPlateCount,
    setInventoryOpen,
  } = useCalculatorState(defaults);

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
