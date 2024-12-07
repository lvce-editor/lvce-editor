import * as HandleRequest from '../HandleRequest/HandleRequest.js'

export const handleMessageFromParent = async (message, socket) => {
  if (!socket) {
    // socket got closed
    console.log('socket got closed')
    return
  }
  const request = message.params[0]
  await HandleRequest.handleRequest(request, socket)
}
