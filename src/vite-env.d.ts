/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_PUBLIC_URL: string;
  // add other env vars you use, e.g.
  // readonly VITE_SOME_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
