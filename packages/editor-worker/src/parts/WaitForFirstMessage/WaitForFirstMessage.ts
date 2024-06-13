import * as Promises from '../Promises/Promises.ts'

export const waitForFirstMessage = async (port: MessagePort): Promise<MessageEvent<any>> => {
  const { resolve, promise } = Promises.withResolvers<MessageEvent<any>>()
  const cleanup = (value: MessageEvent<any>) => {
    port.onmessage = null
    resolve(value)
  }
  const handleMessage = (event: MessageEvent) => {
    cleanup(event)
  }
  port.onmessage = handleMessage
  const event = await promise
  return event
}
