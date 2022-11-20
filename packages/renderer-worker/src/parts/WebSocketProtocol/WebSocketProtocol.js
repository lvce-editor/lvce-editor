import * as Protocol from '../Protocol/Protocol.js'

export const getWebSocketProtocol = () => {
  return location.protocol === Protocol.Https ? Protocol.Wss : Protocol.Ws
}
