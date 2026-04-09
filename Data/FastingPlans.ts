export type FastingPlan = {
  id: string;
  title: string;
  fast: number;
  eat: number;
};

export const FASTING_PLANS: FastingPlan[] = [
  { id: "14-10", title: "14-10", fast: 14, eat: 10 },
  { id: "16-8", title: "16-8", fast: 16, eat: 8 },
  { id: "18-6", title: "18-6", fast: 18, eat: 6 },
  { id: "20-4", title: "20-4", fast: 20, eat: 4 },
];
