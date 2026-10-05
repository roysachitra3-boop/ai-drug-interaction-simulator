# ALPHA AI Drug Interaction Simulator

An educational web and desktop application for exploring drug and protein models in 3D. The project includes a scripted demonstration, an optional AI-assisted explanation flow, and a visual human-cell explorer.

> **Educational use only:** This project is not a medical device and does not provide a diagnosis, treatment recommendation, clinical prediction, validated docking result, or proof that a drug is safe or effective. Do not use its output for medical decisions.

## Contents

- [Features](#features)
- [Quick start for users](#quick-start-for-users)
- [Guided walkthrough](#guided-walkthrough)
- [Important notes about analysis](#important-notes-about-analysis)
- [Application sections](#application-sections)
- [Demo data and result matrix](#demo-data-and-result-matrix)
- [What the AI request contains](#what-the-ai-request-contains)
- [3D viewer controls and model formats](#3d-viewer-controls-and-model-formats)
- [Technology](#technology)
- [Requirements](#requirements)
- [Run locally](#run-locally)
- [AI Analysis and API keys](#ai-analysis-and-api-keys)
- [Build the application](#build-the-application)
- [Development workflow](#development-workflow)
- [Project structure](#project-structure)
- [Adding demo models and results](#adding-demo-models-and-results)
- [Troubleshooting](#troubleshooting)
- [Privacy and security](#privacy-and-security)
- [Limitations](#limitations)
- [License](#license)

## Features

- Interactive 3D rendering of bundled GLB molecular models.
- Scripted demo flow with predefined drug/protein pair results.
- Optional AI-generated educational text using a user's own Groq or OpenRouter API key.
- Local GLB/GLTF model selection for the AI Analysis viewer.
- Human-cell 3D explorer with selectable cell structures.
- Responsive React interface and a Windows desktop build using Electron.

## Quick start for users

You can explore the bundled demo without creating an account or providing an API key:

1. Open the application and choose **Demo Analysis**.
2. Select one drug and one protein target.
3. Start the demonstration and wait for the scripted sequence to finish.
4. Review the predefined level, score and explanation; use the 3D viewer to rotate, zoom and pan the models.

For **AI Analysis**, provide a key from your own supported provider. The app does not supply a shared key. See [AI Analysis and API keys](#ai-analysis-and-api-keys) before using this feature.

## Guided walkthrough

### Demo Analysis

The demo page begins with an interactive molecular viewer and selection cards. Choose a drug and protein to enable the simulation button. The app then plays a short visual sequence and displays the matching predefined result. Choose **Run again** to replay the sequence or **Back to demo** to select another pair.

The viewer animation moves the models toward the center, briefly flashes them, then animates model pieces outward. This is a presentation effect, not a physical simulation.

### AI Analysis

The AI page has a provider selector, API key field, model selector, two file upload controls and the 3D viewer. Select the provider first; the available model list follows that provider. Upload one ligand/drug model and one target/protein model. The run button becomes available when both files are selected and the key has the expected provider prefix.

After the provider responds, the app displays the selected filenames, returned interaction category, score and explanation. The provider response is requested in JSON format by the prompt, but model output is not guaranteed to follow instructions exactly. The app attempts to parse the returned JSON and uses fallback values if the expected fields are missing.

### External Visualization

The external visualization page loads the bundled human-cell model. Select a cell structure in the 3D model or its structure list to isolate it and show a short educational description. Use the reset control to restore the view.

This section does not score, simulate or analyze molecular interactions.

### Team Alpha and Alpha Medi

The Team Alpha page displays the team and mentor information stored in `src/data/teamAlpha.ts`. The Alpha Medi links open an external website; Alpha Medi itself is not hosted as an AI service by this repository.

## Important notes about analysis

The app has two different analysis experiences:

1. **Demo Analysis** uses fixed, hand-authored result data. Its score and interaction level are illustrative demo values; they are not calculated from molecular geometry.
2. **AI Analysis** sends the selected language model a prompt containing the uploaded files' names and sizes. The model does **not** receive or inspect the GLB/GLTF contents, and the app does not run molecular docking or scientific interaction calculations. AI output can be incorrect or fabricated.

The 3D viewer displays models for visualization. A visual fit, animation, score, or AI explanation must not be interpreted as evidence of a real biological interaction.

## Application sections

| Section | Route | Description |
| --- | --- | --- |
| Home | `/` | Project introduction and links to the main sections. |
| Demo Analysis | `/demo` | Select one of two bundled demo drugs and one of two protein targets, view them in 3D, and display a predefined result. |
| AI Analysis | `/ai` | Select a provider and model, choose a user's API key, select local GLB/GLTF files, view them in 3D, and request an educational language-model response. |
| External Visualization | `/external` | Explore the bundled human-cell model and inspect selectable structures. This section is visual-only. |
| Team Alpha | `/team` | View the project team's member, mentor, workflow, and focus-area information. |
| Alpha Medi redirect | `/alphamedi` | Redirects to the external Alpha Medi website. |

3D models support mouse drag to rotate, scroll to zoom, and right-drag to pan. The molecular viewer also has a **Reset view** control.

## Demo data and result matrix

The bundled demo currently has two placeholder drug models and two placeholder target models. All four possible pairings have predefined results:

| Drug | Target | Demo level | Demo score |
| --- | --- | --- | ---: |
| Drug A | Protein X | HIGH | 82 / 100 |
| Drug A | Protein Y | MEDIUM | 54 / 100 |
| Drug B | Protein X | LOW | 27 / 100 |
| Drug B | Protein Y | MEDIUM | 61 / 100 |

These values and their explanations are authored in `src/data/demoInteractions.ts`. They exist to demonstrate the interface and are not computed from the bundled models, scientific measurements or a validated pharmacology dataset. The placeholder names are intentional; do not infer the identity of a real drug or protein from them.

Bundled molecular model files are in `public/models/`:

| File | Use |
| --- | --- |
| `DRUGA.glb` and `DRUGB.glb` | Demo ligand/drug display |
| `PROTEINX.glb` and `PROTEINY.glb` | Demo target display |
| `humancellsample3dmodel.glb` | External human-cell visualization |

## What the AI request contains

The AI Analysis feature makes a chat-completions request from the user's browser to the selected provider. The request contains:

- The selected provider's model ID.
- A fixed system prompt describing the feature as an educational tool and requesting a compact JSON response.
- The uploaded drug and protein model filenames.
- Each uploaded file's size rounded to kilobytes.
- The user's API key in the authorization header.

The request does **not** contain the binary contents of either uploaded model. Those files are loaded by the browser's 3D viewer for display. No docking engine, molecular geometry analysis, binding-energy calculation or scientific scoring step runs in this project.

The response is expected to contain an interaction level (`HIGH`, `MEDIUM` or `LOW`), an integer score from 0 to 100, and a short explanation. The application clamps numeric scores into that range and uses fallback values if the response cannot be parsed. These safeguards only keep the interface displayable; they do not verify that the answer is scientifically correct.

## Technology

- React 19 and TypeScript
- TanStack Start and TanStack Router
- Vite
- Tailwind CSS
- Three.js, React Three Fiber, and Drei
- Electron and electron-builder for the Windows desktop package
- Groq and OpenRouter-compatible chat completions APIs (optional)

## Requirements

- Node.js compatible with the installed Vite and Electron toolchain
- npm
- A modern browser with WebGL support for the 3D viewer
- Internet access for installing dependencies and, when used, contacting the selected AI provider
- A Groq or OpenRouter account and a valid personal API key, only if you want to use AI Analysis

## Run locally

```bash
git clone <repository-url>
cd <repository-folder>
npm ci
npm run dev
```

Open the local URL printed by Vite in your terminal.

The project contains both `package-lock.json` and `bun.lock`, but the documented installation and scripts use npm. Use the npm lockfile and commands below for a consistent npm setup; avoid mixing package managers in the same working copy.

To launch the Electron desktop app during development, build the web application first and then start Electron:

```bash
npm run build
npm run electron
```

## AI Analysis and API keys

AI Analysis is optional. Demo Analysis and the 3D visualizations do not require an AI API key.

1. Create your own API key with [Groq](https://console.groq.com/keys) or [OpenRouter](https://openrouter.ai/keys).
2. Open **AI Analysis**, select the matching provider, and paste your own key.
3. Choose a supported model, select a local `.glb` or `.gltf` drug model and protein model, and start the analysis.

The app sends the API request directly from the browser to the selected provider; there is no project API server or project-owned API key. The key is saved in that browser origin's `localStorage` for convenience and is included in requests to the selected provider. It is not committed to this repository by the app. `localStorage` is browser storage, not an encrypted secrets vault: do not use a shared or untrusted browser, and clear this site's browser storage to remove a saved key. The Electron app uses a dynamically selected local port, so do not rely on the saved key persisting across separate desktop launches. The API provider's own terms, privacy policy, rate limits, and charges apply.

Only the selected model ID, prompt text, uploaded model filenames, and file sizes are used in the AI request. The GLB/GLTF file contents are loaded locally for display and are not sent to the AI provider by this feature.

**Never paste an API key into source code, a README, an issue, a screenshot, or a committed `.env` file.** The repository's `.gitignore` excludes `.env` files (except an optional `.env.example`) and keeps generated build output out of Git. The app does not require a project-level API key in an environment file.

### Supported provider and model choices

The current model choices are defined in `src/lib/alphamedi.ts`:

| Provider | Model IDs currently offered |
| --- | --- |
| Groq | `llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, `openai/gpt-oss-120b`, `qwen/qwen3-32b` |
| OpenRouter | `openai/gpt-4o-mini`, `anthropic/claude-3.5-sonnet`, `google/gemini-2.0-flash-001`, `meta-llama/llama-3.3-70b-instruct` |

Provider catalogs, model availability, API formats, account requirements and prices may change. A model appearing in this list does not guarantee that a provider account can use it.

## Build the application

```bash
# Create the production web and server build in dist/
npm run build

# Preview the production build locally
npm run preview

# Create a Windows installer in release/
npm run dist:win
```

Other available scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build:dev` | Build with Vite's development mode. |
| `npm run electron` | Start Electron; run `npm run build` first. |
| `npm run lint` | Run ESLint. |
| `npm run format` | Format files with Prettier. |

Generated web output goes to `dist/`; the Windows installer goes to `release/`. These are generated artifacts and should not be committed as source files.

### Windows desktop packaging

The Electron main process starts a local HTTP server bound to the loopback interface, chooses an available local port, serves the built client files from `dist/client`, and forwards application requests to the built TanStack server entry in `dist/server`. Electron then opens that local application URL in a desktop window.

`npm run dist:win` runs the web production build and invokes electron-builder with the Windows NSIS installer target. Installer options are configured in the `build` section of `package.json`. The produced installer and unpacked app are generated files under `release/`; they are ignored by Git.

The Windows packaging script creates a Windows installer. It does not by itself configure code signing, automatic updates, macOS packaging or Linux packaging.

## Development workflow

1. Install dependencies with `npm ci`.
2. Start the local development server with `npm run dev`.
3. Make application changes under `src/`; static model assets belong in `public/models/`.
4. Run `npm run lint` and `npm run build` before sharing a change.
5. To check the Electron runtime, run `npm run build` followed by `npm run electron`.
6. To create a Windows installer, run `npm run dist:win` on a supported Windows build environment.

There is currently no `test` script or checked-in automated test suite in `package.json`. Build success confirms that Vite can produce the configured client and server bundles; it does not replace browser-based checks of the routes, AI provider request, 3D models or installer.

Lint status can depend on formatting in the current checkout. Resolve reported lint errors before treating a lint run as a clean check; do not assume a successful production build means lint also passes.

## Project structure

```text
.
├── electron-main.cjs       # Electron window and local application server
├── eslint.config.js        # ESLint and Prettier integration
├── public/
│   ├── models/             # Bundled GLB models served by the app
│   └── robots.txt          # Search engine crawl instructions
├── src/
│   ├── components/
│   │   ├── demo/           # Demo selection, sequence, results and disclaimer
│   │   ├── ui/             # Reusable interface components
│   │   └── viewer/         # Molecular and cell 3D viewers
│   ├── data/               # Demo data, model definitions, team and cell parts
│   ├── lib/                # AI requests, storage helpers and error handling
│   ├── routes/             # Home, demo, AI, team and visualization routes
│   ├── assets/             # Model asset metadata generated for imported assets
│   ├── router.tsx          # Router setup
│   ├── routeTree.gen.ts    # Generated TanStack Router route tree
│   ├── start.ts            # TanStack Start setup
│   └── server.ts           # TanStack Start server entry and error handling
├── package.json            # Scripts, dependencies and Electron build settings
├── package-lock.json       # npm dependency lockfile
├── bun.lock                # Bun dependency lockfile
├── bunfig.toml             # Bun install configuration
├── tsconfig.json           # TypeScript compiler configuration
└── vite.config.ts          # Vite/TanStack Start configuration
```

### Important source locations

| Location | Responsibility |
| --- | --- |
| `src/data/drugs.ts` | Demo drug names, descriptions and model paths. |
| `src/data/proteins.ts` | Demo target names, descriptions and model paths. |
| `src/data/demoInteractions.ts` | Fixed demo result matrix and educational disclaimer. |
| `src/data/externalModels.ts` | Model metadata shown in External Visualization. |
| `src/data/cellParts.ts` | Human-readable cell parts and corresponding GLB node names. |
| `src/lib/alphamedi.ts` | AI provider endpoints/model choices and Alpha Medi prompt/context logic. |
| `src/lib/aiAnalysis.ts` | AI Analysis request construction, response parsing and fallback values. |
| `src/lib/safeStorage.ts` | Guarded browser `localStorage` access. |
| `src/components/viewer/` | WebGL viewers, model loading, cell interaction and viewer fallback UI. |
| `src/routes/` | Page-level route components and page metadata. |
| `electron-main.cjs` | Electron window, loopback server and static file handling. |

## Adding demo models and results

To add a predefined demo drug or protein:

1. Add its `.glb` file under `public/models/`.
2. Add an entry pointing to `/models/<file-name>.glb` in `src/data/drugs.ts` or `src/data/proteins.ts`.
3. Add a corresponding predefined educational result in `src/data/demoInteractions.ts`.

The demo result is data-driven and remains illustrative; adding a model does not add scientific docking or validation.

The external visualization model definitions are in `src/data/externalModels.ts`. Cell structure labels and model-node mappings are in `src/data/cellParts.ts`; mappings must match the node names in the GLB model.

For a model to appear as an explorable cell part, its node names must match the `nodes` entries in `CELL_PARTS`. If a name does not exist in the GLB scene, that part cannot be isolated from the model. Validate updated assets in the application; a successful TypeScript build does not inspect GLB internals.

For the AI Analysis page, user-selected models are local browser files. Adding a file to `public/models/` is not required for a user to select it, and the AI request still receives only the filename and file size.

## 3D viewer controls and model formats

The viewer uses Three.js through React Three Fiber and Drei. The model loader centers a loaded model around its bounding-box center and scales it relative to its longest dimension so differently sized assets can be shown in a shared scene. The molecular viewer clones the loaded scene before applying its display animation.

| Input | Expected use |
| --- | --- |
| `.glb` | Binary glTF model. Used for bundled models and accepted by the AI Analysis file picker. |
| `.gltf` | JSON glTF model. Accepted by the AI Analysis file picker; any referenced external textures or buffers must also be available to the browser for the model to render. |

For best compatibility, test the model in a current browser with WebGL enabled. Large or complex assets may take longer to load or perform poorly on lower-powered devices. The viewer has an inline error state so a WebGL/model loading failure should not prevent the rest of the page from working.

| Mouse action | Viewer action |
| --- | --- |
| Left-click and drag | Rotate |
| Scroll wheel | Zoom |
| Right-click and drag | Pan |
| Reset view button | Restore the camera controls |

## Troubleshooting

| Problem | Things to check |
| --- | --- |
| `npm ci` fails | Confirm Node.js and npm are installed, use the npm lockfile, and retry with a working internet connection. Read the first package error; do not delete the lockfile as a first fix. |
| `npm run dev` does not start | Check the terminal output for a port conflict, missing dependency or unsupported Node.js version. Install dependencies from the project root. |
| A 3D viewer is blank or reports unavailable | Check that WebGL/hardware acceleration is enabled, the model URL or selected file is valid, and any model dependencies are accessible. Try a current browser and reload the page. |
| An uploaded GLTF model has missing textures | A `.gltf` file may refer to separate texture/buffer files, but the current upload control selects one file at a time. Prefer a self-contained `.glb`, or use a `.gltf` whose required resources are embedded in the file. |
| AI request says the key is invalid | Confirm the correct provider is selected and the personal key belongs to that provider. The UI checks only the expected key prefix; the provider validates the key itself. |
| AI request is rate-limited or has no quota | Check the selected provider account, model access, billing/quota and current provider service status. The project cannot increase provider limits. |
| An AI model returns an unexpected answer | The provider response is generated by an LLM and may be incomplete or invalid. Retry with an available model, but do not treat any output as a medical result. |
| Windows desktop app does not open | Run `npm run build` first, then `npm run electron`. If packaged, confirm the installer completed and consult the console/log output for runtime errors. |
| ESLint reports formatting errors | Run `npm run lint` to see affected files. Apply and review formatting changes; `npm run format` writes formatting changes across the project, so inspect its diff before keeping it. |

## Privacy and security

- Never commit provider API keys, passwords, access tokens, private keys, or personal credentials.
- Users provide their own provider key in the AI Analysis interface. The app saves it in browser `localStorage` and sends it to the chosen provider when requesting a response.
- Uploaded model files are used by the browser-based 3D viewer. The AI request uses their filenames and sizes, not their file contents.
- Do not use real patient data or confidential health information with this educational project or an external AI provider.
- Before making a repository public, review all project data and confirm you have permission to publish it.

## Limitations

- Results are demonstrations, not experimentally or clinically validated.
- AI-generated content can be inaccurate, incomplete, biased, or unavailable.
- AI provider access requires the user to have a valid key, account, network connection, and any required quota.
- 3D rendering performance depends on the user's device, browser, graphics hardware, and model size.
- This project does not include an automated test suite or a backend that securely stores user credentials.

## License

No license file is currently included. Unless a license is added, the project is not explicitly licensed for reuse, redistribution, or modification by others. Add a license only after confirming the project owners' choice and rights to all included code and assets.
