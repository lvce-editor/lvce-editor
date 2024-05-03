export const isElectron = () => {
  return Boolean(process.env.ELECTRON_RUN_AS_NODE) || 'electron' in process.versions
}
