import { useCallback, useState } from "react";
import {
  ALL_PLATES,
  DEFAULT_BAR,
  DEFAULT_PLATE_INVENTORY,
  DEFAULT_TARGET,
} from "./constants";

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

function getInitialState() {
  const searchParams = new URLSearchParams(window.location.search);
  const urlTarget = searchParams.get("target");
  const urlBar = searchParams.get("bar");
  const urlInv = parseInventoryParam(searchParams.get("inv"));
  const urlInvOpen = searchParams.get("invOpen");

  return {
    targetWeight:
      urlTarget !== null
        ? Math.max(Number(urlTarget) || 0, 1)
        : DEFAULT_TARGET,
    barbellWeight:
      urlBar !== null
        ? Math.max(Number(urlBar) || 0, 0)
        : DEFAULT_BAR,
    plateInventory: urlInv ?? { ...DEFAULT_PLATE_INVENTORY },
    inventoryOpen: urlInvOpen === "true",
  };
}

export function useCalculatorState() {
  const [state, setState] = useState(getInitialState);

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

  const setInventoryOpen = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, inventoryOpen: open }));
  }, []);

  return {
    targetWeight: state.targetWeight,
    barbellWeight: state.barbellWeight,
    plateInventory: state.plateInventory,
    inventoryOpen: state.inventoryOpen,
    setTargetWeight,
    setBarbellWeight,
    setPlateCount,
    adjustTargetWeight,
    setInventoryOpen,
  };
}

export function buildShareUrl(state: {
  targetWeight: number;
  barbellWeight: number;
  plateInventory: Record<number, number>;
  inventoryOpen?: boolean;
}) {
  const params = new URLSearchParams();
  if (state.targetWeight) params.set("target", String(state.targetWeight));
  if (state.barbellWeight) params.set("bar", String(state.barbellWeight));
  const inv = serializeInventory(state.plateInventory);
  if (inv) params.set("inv", inv);
  if (state.inventoryOpen) params.set("invOpen", "true");
  const qs = params.toString();
  return `${window.location.origin}${window.location.pathname}${qs ? `?${qs}` : ""}`;
}
