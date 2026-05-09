export type RuneInput = {
  id: string;
  tags?: string[];
  tier?: number;
  difficultyModifier?: number;
};

export type RuneSuggestion = {
  ids: string[];
  score: number;
  reason: string | null;
};

export function suggestRuneCombinations(runes: RuneInput[]): RuneSuggestion[] {
  if (runes.length === 0) return [];
  return [];
}
