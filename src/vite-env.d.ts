/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_OPENAI_ASSISTANT_ID: string
  readonly VITE_SITE_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

