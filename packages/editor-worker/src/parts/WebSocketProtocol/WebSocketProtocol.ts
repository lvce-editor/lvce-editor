import * as Protocol from '../Protocol/Protocol.ts'

export const getWebSocketProtocol = () => {
  return location.protocol === Protocol.Https ? Protocol.Wss : Protocol.Ws
}
