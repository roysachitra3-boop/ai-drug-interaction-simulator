export type ExternalModel = {
  id: string;
  name: string;
  caption: string;
  /**
   * URL of the uploaded .glb asset.
   * After uploading a model, import its `*.glb.asset.json` file and use `asset.url` here.
   */
  modelUrl: string | null;
};

/** Visual-only showcase models for the External Visualization section. */
export const EXTERNAL_MODELS: ExternalModel[] = [
  {
    id: "HUMAN_CELL",
    name: "Human Cell",
    caption:
      "An interactive holographic cell explorer — click any organelle in the model or the structure index to detach it from the cell, isolate it and read what it does.",
    modelUrl: "/models/humancellsample3dmodel.glb",
  },
];

