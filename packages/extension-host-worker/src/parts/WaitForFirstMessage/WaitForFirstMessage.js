export const waitForFirstMessage = async (port) => {
  const event = await new Promise((resolve) => {
    const cleanup = (value) => {
      port.onmessage = null
      resolve(value)
    }
    const handleMessage = (event) => {
      cleanup(event)
    }
    port.onmessage = handleMessage
  })
  return event.data
}
