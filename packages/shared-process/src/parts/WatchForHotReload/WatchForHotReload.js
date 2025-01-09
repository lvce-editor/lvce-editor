import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as FileSystemWatch from '../WatchFile/WatchFile.js'

const hasWatcher = new WeakSet()

export const watchForHotReload = async (socket, configs) => {
  if (hasWatcher.has(socket)) {
    return
  }
  hasWatcher.add(socket)
  // TODO when socket closes, dispose file watcher?
  // or keep file watcher and broadcast to all sockets?
  await Promise.all(
    configs.map(async (config) => {
      const callback = () => {
        socket.send({ jsonrpc: JsonRpcVersion.Two, method: config.command, params: [] })
      }
      await FileSystemWatch.watchFile(config.path, callback)
    }),
  )
}
