import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
  ALL_PLATES,
  DEFAULT_BAR,
  DEFAULT_PLATE_INVENTORY,
  DEFAULT_TARGET,
  STORAGE_KEY,
} from "./constants";

interface StoredState {
  targetWeight: number;
  barbellWeight: number;
  plateInventory: Record<number, number>;
}

function readFromStorage(): Partial<StoredState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function parseInventoryParam(value: string | null): Record<number, number> | null {
  if (!value) return null;
  const entries = value.split(",").map((s) => s.trim());
  const inventory: Record<number, number> = {};
  for (const entry of entries) {
    const [weightStr, countStr] = entry.split("x");
    const weight = Number(weightStr);
    const count = Number(countStr);
    if (!isNaN(weight) && weight > 0 && !isNaN(count) && count >= 0) {
      inventory[weight] = count;
    }
  }
  return Object.keys(inventory).length > 0 ? inventory : null;
}

function serializeInventory(inventory: Record<number, number>): string {
  return ALL_PLATES.filter((w) => (inventory[w] ?? 0) > 0)
    .sort((a, b) => b - a)
    .map((w) => `${w}x${inventory[w]}`)
    .join(",");
}

function getInitialState(searchParams: URLSearchParams) {
  const stored = readFromStorage();

  const urlTarget = searchParams.get("target");
  const urlBar = searchParams.get("bar");
  const urlInv = parseInventoryParam(searchParams.get("inv"));

  return {
    targetWeight:
      urlTarget !== null
        ? Math.max(Number(urlTarget) || 0, 1)
        : (stored.targetWeight ?? DEFAULT_TARGET),
    barbellWeight:
      urlBar !== null
        ? Math.max(Number(urlBar) || 0, 0)
        : (stored.barbellWeight ?? DEFAULT_BAR),
    plateInventory: urlInv ?? stored.plateInventory ?? { ...DEFAULT_PLATE_INVENTORY },
  };
}

export function useCalculatorState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState(() => getInitialState(searchParams));

  useEffect(() => {
    const params = new URLSearchParams();
    if (state.targetWeight) params.set("target", String(state.targetWeight));
    if (state.barbellWeight) params.set("bar", String(state.barbellWeight));
    const inv = serializeInventory(state.plateInventory);
    if (inv) params.set("inv", inv);
    setSearchParams(params, { replace: true });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, setSearchParams]);

  const setTargetWeight = useCallback((weight: number) => {
    setState((prev) => ({
      ...prev,
      targetWeight: Math.max(weight, prev.barbellWeight),
    }));
  }, []);

  const setBarbellWeight = useCallback((weight: number) => {
    setState((prev) => ({
      ...prev,
      barbellWeight: Math.max(weight, 0),
      targetWeight: Math.max(prev.targetWeight, Math.max(weight, 0)),
    }));
  }, []);

  const adjustTargetWeight = useCallback((delta: number) => {
    setState((prev) => ({
      ...prev,
      targetWeight: Math.max(prev.targetWeight + delta, prev.barbellWeight),
    }));
  }, []);

  const setPlateCount = useCallback((weight: number, count: number) => {
    setState((prev) => ({
      ...prev,
      plateInventory: {
        ...prev.plateInventory,
        [weight]: Math.max(count, 0),
      },
    }));
  }, []);

  return {
    targetWeight: state.targetWeight,
    barbellWeight: state.barbellWeight,
    plateInventory: state.plateInventory,
    setTargetWeight,
    setBarbellWeight,
    setPlateCount,
    adjustTargetWeight,
  };
}
