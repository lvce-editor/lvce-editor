const send = (ipc, message) => {
  if ('send' in ipc) {
    ipc.send(message)
    return
  }
  ipc.postMessage(message)
}

export const handleJsonRpcMessage = async (ipc, message, execute, resolve, source) => {
  if (!message || typeof message === 'string') {
    console.warn(`unexpected message from ${source}: ${message}`)
    return
  }
  if (message.id) {
    if ('method' in message) {
      try {
        const result = await execute(message.method, ...message.params)
        send(ipc, {
          jsonrpc: '2.0',
          id: message.id,
          result,
        })
        return
      } catch (error) {
        send(ipc, {
          jsonrpc: '2.0',
          id: message.id,
          error,
        })
        return
      }
    }
    resolve(message.id, message)
    return
  }
  await execute(message.method, ...message.params)
}
