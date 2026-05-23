export interface PlateAllocation {
  weight: number;
  countPerSide: number;
}

export interface CalculationResult {
  perSide: PlateAllocation[];
  totalWeightAchieved: number;
  exact: boolean;
  shortBy: number;
}

export function calculatePlates(
  targetWeight: number,
  barbellWeight: number,
  inventory: Record<number, number>
): CalculationResult | null {
  if (targetWeight <= barbellWeight) return null;

  const plates = Object.entries(inventory)
    .map(([weight, count]) => ({ weight: Number(weight), count: Math.floor(count / 2) }))
    .filter((p) => p.count > 0)
    .sort((a, b) => b.weight - a.weight);

  if (plates.length === 0) return null;

  const targetG = Math.round(targetWeight * 1000);
  const barG = Math.round(barbellWeight * 1000);

  let remainingG = (targetG - barG) / 2;
  const originalG = remainingG;
  const perSide: PlateAllocation[] = [];

  for (const { weight, count: available } of plates) {
    if (remainingG <= 0) break;
    const plateG = Math.round(weight * 1000);
    const maxFit = Math.floor(remainingG / plateG);
    const count = Math.min(maxFit, available);
    if (count > 0) {
      perSide.push({ weight, countPerSide: count });
      remainingG -= count * plateG;
    }
  }

  const usedG = originalG - remainingG;
  const totalWeightAchieved = (barG + usedG * 2) / 1000;

  return {
    perSide,
    totalWeightAchieved,
    exact: remainingG === 0,
    shortBy: remainingG / 1000,
  };
}
