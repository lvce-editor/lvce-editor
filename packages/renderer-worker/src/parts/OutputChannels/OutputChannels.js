import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as ExtensionHostOutputChannel from '../ExtensionHost/ExtensionHostOutput.js'

const toExtensionHostOption = (outputChannel) => {
  return {
    name: outputChannel.id,
    file: outputChannel.path,
  }
}

const getBuiltinOutputChannels = () => {
  return [
    {
      name: 'Main',
      file: '/tmp/log-main.txt',
    },
    {
      name: 'Shared Process',
      file: '/tmp/log-shared-process.txt',
    },
  ]
}

export const getOutputChannels = async () => {
  const extensionHostChannels =
    await ExtensionHostOutputChannel.getOutputChannels()
  const builtinChannels = getBuiltinOutputChannels()
  const channels = [
    ...builtinChannels,
    ...extensionHostChannels.map(toExtensionHostOption),
  ]
  return channels
}
