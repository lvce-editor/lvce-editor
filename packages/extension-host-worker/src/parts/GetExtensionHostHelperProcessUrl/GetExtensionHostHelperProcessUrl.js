export const getExtensionHostHelperProcessUrl = () => {
  // return new URL('../../../../extension-host-helper-process/src/extensionHostHelperProcessMain.js', import.meta.url).toString()
  return new URL('../IpcClient/IpcClient.js', import.meta.url).toString()
}
