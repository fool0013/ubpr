export default defineConfig(async config => {
  const { mode, command } = config;
  const envPort = Number(loadEnv(mode, process.cwd()).VITE_PORT);

  return {
    ...(await sharedConfig(config)),
    base: "/ubpr/",
    publicDir: ".",
    server: {
      port: Number.isNaN(envPort) ? 8000 : envPort,
    },
  } satisfies UserConfig;
});
