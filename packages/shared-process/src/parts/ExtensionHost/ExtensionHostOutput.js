export const getOutputChannels = (extensionHost) => {
  return extensionHost.invoke('OutputChannel.getOutputChannels')
}
