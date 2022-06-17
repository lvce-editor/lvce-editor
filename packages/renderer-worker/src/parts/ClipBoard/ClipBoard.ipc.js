import * as Command from '../Command/Command.js'
import * as ClipBoard from './ClipBoard.js'

export const __initialize__ = () => {
  Command.register(240, ClipBoard.readText)
  Command.register(241, ClipBoard.writeText)
  Command.register(243, ClipBoard.writeNativeFiles)
  Command.register(244, ClipBoard.readNativeFiles)
}
