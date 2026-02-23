/*
 * SPDX-FileCopyrightText: 2024-2025 Pagefault Games
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineConfig, loadEnv, type UserConfig, type UserConfigFnPromise } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Default config object used for both Vitest and local dev runs.
 */
export const sharedConfig: UserConfigFnPromise = async ({ mode }) =>
  ({
    plugins: process.env.MERGE_REPORTS
      ? []
      : [
          tsconfigPaths(),
          (await import("./src/plugins/vite/vite-minify-json-plugin")).minifyJsonPlugin(
            ["images", "battle-anims"],
            true,
          ),
          (await import("./src/plugins/vite/namespaces-i18n-plugin")).LocaleNamespace(),
        ],
    clearScreen: false,
    appType: "mpa",
    build: {
      chunkSizeWarningLimit: 10000,
      minify: "esbuild",
      outDir: "dist",
      sourcemap: mode !== "production",
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
            return;
          }
          defaultHandler(warning);
        },
      },
    },
    esbuild: {
      pure: mode === "production" ? ["console.log"] : [],
      keepNames: true,
    },
  }) satisfies UserConfig;

// biome-ignore lint/style/noDefaultExport: required for Vite
export default defineConfig(async config => {
  const { mode } = config;
  const envPort = Number(loadEnv(mode, process.cwd()).VITE_PORT);

  return {
    ...(await sharedConfig(config)),
    base: "./", 
    publicDir: ".", 
    server: {
      port: Number.isNaN(envPort) ? 8000 : envPort,
    },
  } satisfies UserConfig;
});
