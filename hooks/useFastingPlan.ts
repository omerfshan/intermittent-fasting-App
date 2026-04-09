import { FASTING_PLANS, FastingPlan } from "@/Data/FastingPlans";
import { useEffect, useState } from "react";

let selectedPlan: FastingPlan = FASTING_PLANS[1];
let listeners: (() => void)[] = [];

export function useFastingPlan() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const listener = () => rerender((n) => n + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const setSelectedPlan = (plan: FastingPlan) => {
    selectedPlan = plan;
    listeners.forEach((l) => l());
  };

  return { selectedPlan, setSelectedPlan };
}
