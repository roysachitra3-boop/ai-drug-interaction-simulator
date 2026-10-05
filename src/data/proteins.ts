export type Protein = {
  id: string;
  name: string;
  role: string;
  summary: string;
  modelUrl: string;
};

/** Predefined demo protein targets. Add new entries here to extend the demo. */
export const PROTEINS: Protein[] = [
  {
    id: "PROTEIN_X",
    name: "Protein X",
    role: "Demo target structure",
    summary: "Macromolecular demo target used to illustrate binding-site visualisation.",
    modelUrl: "/models/PROTEINX.glb",
  },
  {
    id: "PROTEIN_Y",
    name: "Protein Y",
    role: "Demo target structure",
    summary: "Second demo target with a different fold for comparison purposes.",
    modelUrl: "/models/PROTEINY.glb",
  },
];

export const getProtein = (id: string | null) => PROTEINS.find((p) => p.id === id) ?? null;
