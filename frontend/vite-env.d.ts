/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_Auth_Domain: string;
  readonly VITE_PROJECT_ID: string;
  readonly VITE_STORAGE_BUCKET: string;
  readonly VITE_MESSAGING_SENDERID: string;
  readonly VITE_APPID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
