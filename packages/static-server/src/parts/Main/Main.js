import * as HandleMessageFromParent from '../HandleMessageFromParent/HandleMessageFromParent.js'

export const main = () => {
  process.on('message', HandleMessageFromParent.handleMessageFromParent)
  if (process.send) {
    process.send('ready')
  }
}
