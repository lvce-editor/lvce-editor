import { MessageChannelMain } from 'electron'

export const getPortTuple = () => {
  const { port1, port2 } = new MessageChannelMain()
  return { port1, port2 }
}
