import * as Callback from '../Callback/Callback.js'
import * as Env from '../Env/Env.js'

let port

const handleMessage = ({ data }) => {
  // @ts-ignore
  Callback.execute(...data)
}

// @ts-ignore
if (Env.IS_WORKER) {
  onmessage = handleMessage
} else {
  const messageChannel = new MessageChannel()
  messageChannel.port1.onmessage = handleMessage
  port = messageChannel.port2
}

export { port }
