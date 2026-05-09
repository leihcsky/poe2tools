export type WardInputs = {
  baseWard: number;
  recoveryRate?: number;
  mitigation?: number;
};

export type WardResult = {
  totalWard: number;
};

export function calculateWard(inputs: WardInputs): WardResult {
  return { totalWard: inputs.baseWard };
}

