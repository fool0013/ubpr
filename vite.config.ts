export default defineConfig(async config => {
  const { mode } = config;
  const envPort = Number(loadEnv(mode, process.cwd()).VITE_PORT);

  return {
    ...(await sharedConfig(config)),
    base: "./", // Use relative paths for GitHub Pages
    publicDir: ".", // This allows Vite to see locales/ and assets/ in root
    build: {
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,
    },
    server: {
      port: Number.isNaN(envPort) ? 8000 : envPort,
    },
  } satisfies UserConfig;
});
