export const getFirstEvent = async (eventTarget, eventMap) => {
  const { type, event } = await new Promise((resolve, reject) => {
    const listenerMap = Object.create(null)
    const cleanup = (value) => {
      for (const event of Object.keys(eventMap)) {
        eventTarget.removeEventListener(event, listenerMap[event])
      }
      resolve(value)
    }
    for (const [event, type] of Object.entries(eventMap)) {
      const listener = (event) => {
        cleanup({
          type,
          event,
        })
      }
      eventTarget.addEventListener(event, listener)
      listenerMap[event] = listener
    }
  })
  return { type, event }
}
