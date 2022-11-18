export const listen = (ipc) => {
  const handleMessage = (message) => {
    console.log({ message })
  }
  ipc.on('message', handleMessage)
}
