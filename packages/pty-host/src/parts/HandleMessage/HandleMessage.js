import * as CommandMap from '../CommandMap/CommandMap.js'

export const handleMessage = (message, handle) => {
  const fn = CommandMap.getFn(message.method)
  return fn(...message.params, handle)
}
