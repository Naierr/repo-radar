/* eslint-disable @typescript-eslint/naming-convention -- augments Vite's own interface names */

interface ImportMetaEnv {
  /** Where GitHub's REST API is reached from the browser. */
  readonly VITE_GITHUB_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
