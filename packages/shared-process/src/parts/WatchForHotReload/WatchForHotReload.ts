import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.ts'
import * as FileSystemWatch from '../WatchFile/WatchFile.ts'

const hasWatcher = new WeakSet()

export const watchForHotReload = async (socket: any, configs: any): Promise<any> => {
  if (hasWatcher.has(socket)) {
    return
  }
  hasWatcher.add(socket)
  // TODO when socket closes, dispose file watcher?
  // or keep file watcher and broadcast to all sockets?
  await Promise.all(
    configs.map(async (config: any) => {
      const callback = (): any => {
        socket.send({ jsonrpc: JsonRpcVersion.Two, method: config.command, params: [] })
      }
      await FileSystemWatch.watchFile(config.path, callback)
    }),
  )
}
