import * as Command from '../Command/Command.js'

const handleMessage = async (event) => {
  const message = event.data
  await Command.execute(message.method, ...message.params)
}

export const listen = () => {
  onmessage = handleMessage
}
