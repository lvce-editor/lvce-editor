import * as Promises from '../Promises/Promises.ts'

export const waitForFirstMessage = async (port) => {
  const { resolve, promise } = Promises.withResolvers()
  const cleanup = (value) => {
    port.onmessage = null
    resolve(value)
  }
  const handleMessage = (event) => {
    cleanup(event)
  }
  port.onmessage = handleMessage
  const event = await promise
  // @ts-expect-error
  return event.data
}
