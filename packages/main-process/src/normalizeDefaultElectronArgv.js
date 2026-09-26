export const normalizeDefaultElectronArgv = (argv, defaultApp) => {
  if (defaultApp) {
    argv.splice(1, 1)
  }
}
