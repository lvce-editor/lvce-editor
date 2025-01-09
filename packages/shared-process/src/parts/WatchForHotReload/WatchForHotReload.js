import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as FileSystemWatch from '../WatchFile/WatchFile.js'

export const watchForHotReload = async (socket, configs) => {
  await Promise.all(
    configs.map(async (config) => {
      const callback = () => {
        socket.send({ jsonrpc: JsonRpcVersion.Two, method: config.command, params: [] })
      }
      await FileSystemWatch.watchFile(config.path, callback)
    }),
  )
}
