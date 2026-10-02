export const ALL_PLATES = [25, 20, 15, 10, 5, 2.5, 2, 1.25, 1, 0.5] as const;

export type CalculatorDefaults = {
  targetWeight: number;
  barbellWeight: number;
  plateInventory: Record<number, number>;
};

export const DEFAULT_TARGET = 60;
export const DEFAULT_BAR = 20;
export const DEFAULT_PLATE_INVENTORY: Record<number, number> = {
  25: 2,
  20: 2,
  15: 2,
  10: 2,
  5: 2,
  2.5: 2,
  2: 0,
  1.25: 2,
  1: 0,
  0.5: 0,
};

export const HOME_DEFAULTS: CalculatorDefaults = {
  targetWeight: DEFAULT_TARGET,
  barbellWeight: DEFAULT_BAR,
  plateInventory: DEFAULT_PLATE_INVENTORY,
};

export const BARBELL_10KG_DEFAULTS: CalculatorDefaults = {
  targetWeight: 10,
  barbellWeight: 10,
  plateInventory: {
    20: 2,
    10: 1,
    5: 1,
    2.5: 2,
    1.25: 2,
  },
};

export const BARBELL_2KG_DEFAULTS: CalculatorDefaults = {
  targetWeight: 2,
  barbellWeight: 2,
  plateInventory: {
    20: 2,
    10: 1,
    5: 1,
    2.5: 2,
    1.25: 2,
    1: 1,
  },
};
