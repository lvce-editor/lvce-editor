import * as Command from '../Command/Command.js'
import * as WebSocketServer from './WebSocketServer.js'

export const __initialize__ = () => {
 Command.register(5621, WebSocketServer.handleUpgrade)
}
