/// <reference types="vite/client" />

interface ImportMetaEnv {
    MODE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
} 