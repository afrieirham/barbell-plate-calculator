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
  availablePlates: number[]
): CalculationResult | null {
  if (targetWeight <= barbellWeight) return null;

  const plates = [...availablePlates].sort((a, b) => b - a);
  if (plates.length === 0) return null;

  const targetG = Math.round(targetWeight * 1000);
  const barG = Math.round(barbellWeight * 1000);
  const plateGs = plates.map((p) => Math.round(p * 1000));

  let remainingG = (targetG - barG) / 2;
  const originalG = remainingG;
  const perSide: PlateAllocation[] = [];

  for (let i = 0; i < plateGs.length; i++) {
    if (remainingG <= 0) break;
    const count = Math.floor(remainingG / plateGs[i]);
    if (count > 0) {
      perSide.push({ weight: plates[i], countPerSide: count });
      remainingG -= count * plateGs[i];
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
