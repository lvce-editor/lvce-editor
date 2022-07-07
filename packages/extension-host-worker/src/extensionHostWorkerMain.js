import * as Command from './parts/Command/Command.js'

const handleMessage = async (event) => {
  const message = event.data
  await Command.execute(message.method, ...message.params)
}

const Ipc = {
  listen() {
    onmessage = handleMessage
  },
}

const main = () => {
  Ipc.listen()
}

main()
