export const shutdownTerminalProcess = (ipc: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    const removeListener = (): void => {
      if (ipc.removeEventListener) ipc.removeEventListener('close', onClose)
      else ipc.off('close', onClose)
    }
    const onClose = (): void => {
      clearTimeout(timer)
      removeListener()
      resolve()
    }
    const timer = setTimeout(() => {
      removeListener()
      reject(new Error('Terminal process did not exit after shutdown'))
    }, 10_000)
    if (ipc.addEventListener) ipc.addEventListener('close', onClose)
    else ipc.on('close', onClose)
    try {
      ipc.send({ jsonrpc: '2.0', method: 'TerminalProcess.dispose', params: [] })
    } catch (error) {
      clearTimeout(timer)
      removeListener()
      reject(error)
    }
  })
}
