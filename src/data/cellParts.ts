export type CellPart = {
  /** node names inside the GLB that belong to this part */
  nodes: string[];
  id: string;
  name: string;
  description: string;
};

/**
 * Maps the raw node names of the supplied human-cell GLB to human readable
 * organelles with a short, student friendly explanation.
 */
export const CELL_PARTS: CellPart[] = [
  {
    id: "nucleus",
    name: "Nucleus",
    nodes: ["Core_3", "DNA_0"],
    description:
      "The control centre of the cell. It stores the DNA and directs growth, metabolism and cell division by deciding which genes are switched on.",
  },
  {
    id: "mitochondria",
    name: "Mitochondria",
    nodes: ["MITOH_4"],
    description:
      "The powerhouse of the cell. It breaks down nutrients with oxygen to produce ATP, the chemical energy that keeps every cellular process running.",
  },
  {
    id: "rough-er",
    name: "Rough Endoplasmic Reticulum",
    nodes: ["Retic_15"],
    description:
      "A folded membrane network studded with ribosomes. It builds and folds proteins, then packs them for transport to the Golgi apparatus.",
  },
  {
    id: "smooth-er",
    name: "Smooth Endoplasmic Reticulum",
    nodes: ["Smooth Re_13"],
    description:
      "A ribosome-free membrane network that makes lipids, stores calcium and helps the cell detoxify drugs and harmful substances.",
  },
  {
    id: "golgi",
    name: "Golgi Apparatus",
    nodes: ["Goj_10", "GojB_9"],
    description:
      "The packaging and shipping department. It modifies proteins from the ER, sorts them and dispatches them in vesicles to their destinations.",
  },
  {
    id: "lysosome",
    name: "Lysosomes",
    nodes: ["Lyb_12", "Lyb.001_14"],
    description:
      "Digestive sacs filled with enzymes. They break down worn-out organelles, bacteria and waste, recycling the useful pieces back to the cell.",
  },
  {
    id: "vesicles",
    name: "Vesicles",
    nodes: ["Vors_5"],
    description:
      "Small membrane bubbles that carry cargo such as proteins and lipids between organelles, and out through the cell membrane.",
  },
  {
    id: "centrosome",
    name: "Centrosome",
    nodes: ["Centros_11"],
    description:
      "Organises the microtubule skeleton of the cell and forms the spindle fibres that pull chromosomes apart during cell division.",
  },
  {
    id: "ribosomes",
    name: "Ribosomes",
    nodes: ["Icosphere.001_16"],
    description:
      "Tiny protein factories. They read messenger RNA and link amino acids together to assemble every protein the cell needs.",
  },
  {
    id: "membrane",
    name: "Cell Membrane & Cytoplasm",
    nodes: ["Base_2"],
    description:
      "The outer boundary of the cell and the jelly-like fluid inside it. The membrane controls what enters and leaves, while the cytoplasm suspends and supports the organelles.",
  },
];
