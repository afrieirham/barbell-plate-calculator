import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { ALL_PLATES, DEFAULT_BAR, DEFAULT_TARGET, STORAGE_KEY } from "./constants";

interface StoredState {
  targetWeight: number;
  barbellWeight: number;
  selectedPlates: number[];
}

function readFromStorage(): Partial<StoredState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function parsePlatesParam(value: string | null): number[] | null {
  if (!value) return null;
  const plates = value
    .split(",")
    .map((s) => s.trim())
    .map(Number)
    .filter((n) => !isNaN(n) && n > 0);
  return plates.length > 0 ? plates : null;
}

function getInitialState(searchParams: URLSearchParams) {
  const stored = readFromStorage();

  const urlTarget = searchParams.get("target");
  const urlBar = searchParams.get("bar");
  const urlPlates = parsePlatesParam(searchParams.get("plates"));

  return {
    targetWeight:
      urlTarget !== null
        ? Math.max(Number(urlTarget) || 0, 1)
        : (stored.targetWeight ?? DEFAULT_TARGET),
    barbellWeight:
      urlBar !== null
        ? Math.max(Number(urlBar) || 0, 0)
        : (stored.barbellWeight ?? DEFAULT_BAR),
    selectedPlates: urlPlates ?? stored.selectedPlates ?? [...ALL_PLATES],
  };
}

export function useCalculatorState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState(() => getInitialState(searchParams));

  useEffect(() => {
    const params = new URLSearchParams();
    if (state.targetWeight) params.set("target", String(state.targetWeight));
    if (state.barbellWeight) params.set("bar", String(state.barbellWeight));
    if (state.selectedPlates.length)
      params.set("plates", state.selectedPlates.join(","));
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

  const togglePlate = useCallback((weight: number) => {
    setState((prev) => {
      const exists = prev.selectedPlates.includes(weight);
      return {
        ...prev,
        selectedPlates: exists
          ? prev.selectedPlates.filter((w) => w !== weight)
          : [...prev.selectedPlates, weight].sort((a, b) => b - a),
      };
    });
  }, []);

  return {
    targetWeight: state.targetWeight,
    barbellWeight: state.barbellWeight,
    selectedPlates: state.selectedPlates,
    setTargetWeight,
    setBarbellWeight,
    togglePlate,
    adjustTargetWeight,
  };
}
