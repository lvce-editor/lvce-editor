import { ServerResponse } from 'node:http'

const handleMessageFromParent = (message, socket) => {
  if (!socket) {
    // socket got closed
    console.log('socket got closed')
    return
  }

  const request = message.params[0]
  const response = new ServerResponse(request)
  response.assignSocket(socket)
  response.statusCode = 200
  response.setHeader('Connection', 'close')
  response.end('test response')
  console.log('did send')

  // response.detachSocket(socket)
  // console.log({ request })
  // console.log('got message', message)
}

const main = () => {
  process.on('message', handleMessageFromParent)
  if (process.send) {
    process.send('ready')
  }
}

main()
