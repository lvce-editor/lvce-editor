import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'

export const watch = async (options, onEvent) => {
  const root = new URL(options.roots[0])
  const fileRoots = options.roots.map((value) => {
    const uri = new URL(value)
    if (uri.protocol !== root.protocol || uri.host !== root.host) throw new Error('Remote watcher roots must belong to one server')
    const file = new URL('file:///')
    file.pathname = decodeURIComponent(uri.pathname)
    return file.href
  })
  const url = await WorkspaceConnection.getWebSocketUrl('shared-process')
  if (!url) throw new Error('Remote workspace is disconnected')
  const socket = new WebSocket(url)
  return new Promise((resolve, reject) => {
    let disposed = false
    let ready = false
    const close = () => {
      if (disposed) return
      disposed = true
      clearTimeout(timeout)
      socket.close()
      if (!ready) reject(new Error('Remote file watcher disconnected before becoming ready'))
      else onEvent({ eventName: 'error', uri: '', error: { message: 'Remote file watcher disconnected' } })
    }
    const timeout = setTimeout(close, 30_000)
    socket.onclose = close
    socket.onerror = close
    socket.onopen = () =>
      socket.send(JSON.stringify({ id: 1, jsonrpc: '2.0', method: 'FileWatcher.watch', params: [1, { ...options, roots: fileRoots }] }))
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        if (message.id === 1) {
          if (message.error || message.result?.ok === false) {
            reject(new Error(message.error?.message || message.result.error?.message || 'Remote file watcher failed'))
            close()
            return
          }
          ready = true
          clearTimeout(timeout)
          resolve(() => {
            if (disposed) return
            disposed = true
            socket.onmessage = null
            socket.onclose = null
            socket.onerror = null
            socket.close()
          })
        } else if (message.method === 'FileWatcher.handleEvent') {
          const change = message.params?.[1]
          if (!change || typeof change.uri !== 'string') return
          if (!change.uri) {
            onEvent(change)
            return
          }
          const remoteUri = new URL(change.uri)
          if (remoteUri.protocol !== 'file:') return
          const mapped = new URL(root)
          mapped.pathname = remoteUri.pathname
          onEvent({ ...change, uri: mapped.href })
        }
      } catch {
        close()
      }
    }
  })
}
