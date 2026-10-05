export type Drug = {
  id: string;
  name: string;
  formula: string;
  summary: string;
  modelUrl: string;
};

/** Predefined demo drug models. Add new entries here to extend the demo. */
export const DRUGS: Drug[] = [
  {
    id: "DRUG_A",
    name: "Drug A",
    formula: "Small-molecule ligand",
    summary: "Compact demo ligand model used for the educational interaction demonstration.",
    modelUrl: "/models/DRUGA.glb",
  },
  {
    id: "DRUG_B",
    name: "Drug B",
    formula: "Small-molecule ligand",
    summary: "Alternative demo ligand model with a different structural profile.",
    modelUrl: "/models/DRUGB.glb",
  },
];

export const getDrug = (id: string | null) => DRUGS.find((d) => d.id === id) ?? null;
