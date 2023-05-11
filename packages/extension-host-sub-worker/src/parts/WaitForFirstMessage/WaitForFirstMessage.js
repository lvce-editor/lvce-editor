export const waitForFirstMessage = async (port) => {
  const message = await new Promise((resolve) => {
    const cleanup = (value) => {
      port.onmessage = null
      resolve(value)
    }
    const handleMessage = (message) => {
      cleanup(message)
    }
    port.onmessage = handleMessage
  })
  return message
}
