export const getMemoryUsage = (extensionHost) => {
  return extensionHost.invoke('getMemoryUsage')
}
