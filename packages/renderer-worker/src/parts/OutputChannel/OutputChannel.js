import * as ExtensionHostOutputChannel from '../ExtensionHost/ExtensionHostOutput.js'
import * as OutputChannelState from '../OutputChannelState/OutputChannelState.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

class OutputChannel extends EventTarget {
  constructor() {
    super()
  }
}

const toExtensionHostOption = (outputChannel) => {
  return {
    name: outputChannel.id,
    file: outputChannel.path,
  }
}

export const getOutputChannelOptions = async () => {
  const channels = await ExtensionHostOutputChannel.getOutputChannels()
  const options = [
    {
      name: 'Main',
      file: '/tmp/log-main.txt',
    },
    ...channels.map(toExtensionHostOption),
  ]
  return options
}

export const open = async (id, path) => {
  await SharedProcess.invoke(/* OutputChannel.open */ 'OutputChannel.open', /* id */ id, /* path */ path)
  const eventTarget = new OutputChannel()
  OutputChannelState.set(id, eventTarget)
  return eventTarget
}

export const handleData = (id, data) => {
  const outputChannel = OutputChannelState.get(id)
  outputChannel.dispatchEvent(new Event('data', data))
}

export const dispose = async (id) => {
  await SharedProcess.invoke(/* OutputChannel.close */ 'OutputChannel.close', /* id */ id)
  OutputChannelState.remove(id)
}
