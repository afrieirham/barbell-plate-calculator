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

/**
 * The inventory counts are expressed in pairs (one pair = one plate per side).
 */
export function calculateMaxWeight(
  barbellWeight: number,
  inventory: Record<number, number>
): number {
  const totalPerSide = Object.entries(inventory).reduce((sum, [weight, count]) => {
    return sum + Number(weight) * Math.floor(count);
  }, 0);
  return barbellWeight + totalPerSide * 2;
}

/**
 * Every total weight that can be loaded with the available plates, ascending.
 * Plates load symmetrically, so each per-side sum maps to `bar + 2 * sum`.
 */
export function calculateLoadableWeights(
  barbellWeight: number,
  inventory: Record<number, number>
): number[] {
  const plates = Object.entries(inventory)
    .map(([weight, count]) => ({
      grams: Math.round(Number(weight) * 1000),
      count: Math.floor(count),
    }))
    .filter((p) => p.count > 0 && p.grams > 0);

  const barG = Math.round(barbellWeight * 1000);
  const totalG = plates.reduce((sum, p) => sum + p.grams * p.count, 0);

  const reachable = new Uint8Array(totalG + 1);
  reachable[0] = 1;

  for (const { grams, count } of plates) {
    const used = new Int32Array(totalG + 1);
    for (let s = grams; s <= totalG; s++) {
      if (reachable[s] || !reachable[s - grams]) continue;
      if (used[s - grams] >= count) continue;
      reachable[s] = 1;
      used[s] = used[s - grams] + 1;
    }
  }

  const weights: number[] = [];
  for (let s = 0; s <= totalG; s++) {
    if (reachable[s]) weights.push((barG + s * 2) / 1000);
  }
  return weights;
}

export function calculatePlates(
  targetWeight: number,
  barbellWeight: number,
  inventory: Record<number, number>
): CalculationResult | null {
  if (targetWeight <= barbellWeight) return null;

  const plates = Object.entries(inventory)
    .map(([weight, count]) => ({ weight: Number(weight), count: Math.floor(count) }))
    .filter((p) => p.count > 0)
    .sort((a, b) => b.weight - a.weight);

  if (plates.length === 0) return null;

  const targetG = Math.round(targetWeight * 1000);
  const barG = Math.round(barbellWeight * 1000);
  const perSideG = Math.floor((targetG - barG) / 2);

  const grams = plates.map((p) => Math.round(p.weight * 1000));
  const counts = plates.map((p) => p.count);
  const totalG = grams.reduce((sum, g, i) => sum + g * counts[i], 0);
  const limit = Math.min(perSideG, totalG);

  const width = limit + 1;
  const memo = new Uint8Array(plates.length * width);
  const choice = new Int16Array(plates.length * width).fill(-1);

  const canReach = (index: number, amount: number): boolean => {
    if (amount === 0) return true;
    if (index >= plates.length || amount < 0) return false;
    const key = index * width + amount;
    if (memo[key] !== 0) return memo[key] === 1;
    const plateG = grams[index];
    const maxK = Math.min(counts[index], Math.floor(amount / plateG));
    let reachable = false;
    for (let k = maxK; k >= 0; k--) {
      if (canReach(index + 1, amount - k * plateG)) {
        choice[key] = k;
        reachable = true;
        break;
      }
    }
    memo[key] = reachable ? 1 : 2;
    return reachable;
  };

  let bestG = limit;
  while (bestG > 0 && !canReach(0, bestG)) bestG--;

  const perSide: PlateAllocation[] = [];
  let remainingG = bestG;
  for (let i = 0; i < plates.length && remainingG > 0; i++) {
    const count = choice[i * width + remainingG];
    if (count > 0) {
      perSide.push({ weight: plates[i].weight, countPerSide: count });
      remainingG -= count * grams[i];
    }
  }

  const totalWeightAchieved = (barG + bestG * 2) / 1000;

  return {
    perSide,
    totalWeightAchieved,
    exact: bestG === perSideG,
    shortBy: (perSideG - bestG) / 1000,
  };
}
