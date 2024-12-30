import * as CommandState from '../CommandState/CommandState.js'

const rpcs = Object.create(null)

export const create = async (options) => {
  const fn = CommandState.getCommand('WebView.create')
  const port = rpcs[options.id]
  await fn({
    ...options,
    port,
  })
}

export const setPort = (id, port) => {
  rpcs[id] = port
}
