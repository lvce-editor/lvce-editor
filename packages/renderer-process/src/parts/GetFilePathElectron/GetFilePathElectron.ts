export const getFilePathElectron = (file: File) => {
  return globalThis.webUtils.getFilePathElectron(file)
}
