/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY: string;
  readonly VITE_ENABLE_CODE_RUNNER?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
