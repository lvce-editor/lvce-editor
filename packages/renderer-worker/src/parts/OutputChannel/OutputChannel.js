import * as SharedProcess from '../SharedProcess/SharedProcess.js'

/**
 * @enum {string}
 */
const UiStrings = {
  MainProcess: 'Main Process',
  SharedProcess: 'Shared Process',
}

export const getOutputChannels = async () => {
  const channels = []
  return [
    ...channels,
    {
      name: UiStrings.MainProcess,
      path: '/tmp/log-main-process.txt',
    },
    {
      name: UiStrings.SharedProcess,
      path: '/tmp/log-shared-process.txt',
    },
  ]
}

export const open = async (id, path) => {
  await SharedProcess.invoke(
    /* OutputChannel.open */ 'OutputChannel.open',
    /* id */ id,
    /* path */ path
  )
}

export const close = async (id) => {
  await SharedProcess.invoke(
    /* OutputChannel.close */ 'OutputChannel.close',
    /* id */ id
  )
}
