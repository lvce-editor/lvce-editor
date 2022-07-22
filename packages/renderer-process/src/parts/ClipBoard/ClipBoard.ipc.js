import * as Command from '../Command/Command.js'
import * as ClipBoard from './ClipBoard.js'

export const __initialize__ = () => {
  Command.register('ClipBoard.readText', ClipBoard.readText)
  Command.register('ClipBoard.writeText', ClipBoard.writeText)
}
