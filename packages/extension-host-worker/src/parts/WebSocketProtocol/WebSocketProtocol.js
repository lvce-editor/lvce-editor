export const getWebSocketProtocol = () => {
  return location.protocol === 'https:' ? 'wss:' : 'ws:'
}
