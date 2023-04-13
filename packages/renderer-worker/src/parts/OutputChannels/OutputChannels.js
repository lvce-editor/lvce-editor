import * as ExtensionHostOutputChannel from '../ExtensionHost/ExtensionHostOutput.js'

const toExtensionHostOption = (outputChannel) => {
  return {
    name: outputChannel.id,
    file: outputChannel.path,
  }
}

export const getOptions = async () => {
  // TODO get list of outputChannels from extension host
  const channels = await ExtensionHostOutputChannel.getOutputChannels()
  const options = [
    {
      name: 'Main',
      file: '/tmp/log-main-process.txt',
    },
    ...channels.map(toExtensionHostOption),
  ]
  return options
}
