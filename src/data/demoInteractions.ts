export type InteractionLevel = "HIGH" | "MEDIUM" | "LOW";

export type DemoInteraction = {
  drugId: string;
  proteinId: string;
  level: InteractionLevel;
  score: number;
  explanation: string;
};

/**
 * Predefined demonstration results. Nothing here is randomly generated.
 * Edit these values to change what the demo reports for each pairing.
 */
export const DEMO_INTERACTIONS: DemoInteraction[] = [
  {
    drugId: "DRUG_A",
    proteinId: "PROTEIN_X",
    level: "HIGH",
    score: 82,
    explanation:
      "Educational demonstration of a possible drug-target interaction. In this scripted scenario the ligand shape complements the target pocket, which is illustrated here as a high demo score.",
  },
  {
    drugId: "DRUG_A",
    proteinId: "PROTEIN_Y",
    level: "MEDIUM",
    score: 54,
    explanation:
      "Demonstration of a partial fit. The scripted scenario shows fewer contact points between ligand and target, illustrated as a medium demo score.",
  },
  {
    drugId: "DRUG_B",
    proteinId: "PROTEIN_X",
    level: "LOW",
    score: 27,
    explanation:
      "Demonstration of a poor structural match. The scripted scenario shows limited complementarity, illustrated as a low demo score.",
  },
  {
    drugId: "DRUG_B",
    proteinId: "PROTEIN_Y",
    level: "MEDIUM",
    score: 61,
    explanation:
      "Demonstration of a moderate interaction. The scripted scenario shows partial pocket occupancy, illustrated as a medium demo score.",
  },
];

export function getDemoInteraction(drugId: string, proteinId: string): DemoInteraction {
  return (
    DEMO_INTERACTIONS.find((i) => i.drugId === drugId && i.proteinId === proteinId) ?? {
      drugId,
      proteinId,
      level: "LOW",
      score: 0,
      explanation:
        "No predefined demonstration result exists for this combination yet. Add one to the demo interaction data file.",
    }
  );
}

export const DISCLAIMER =
  "This is an educational computational demonstration using predefined models and results. It is not a medical diagnosis, clinical prediction, or validated drug-effectiveness test.";
