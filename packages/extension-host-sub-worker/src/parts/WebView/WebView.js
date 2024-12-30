import * as CommandState from '../CommandState/CommandState.js'

const ports = Object.create(null)

export const create = async (options) => {
  const fn = CommandState.getCommand('WebView.create')
  const port = ports[options.id]
  await fn({
    ...options,
    port,
  })
}

export const setPort = (id, port) => {
  ports[id] = port
}
