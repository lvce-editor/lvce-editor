import * as Command from '../Command/Command.js'
import * as ClipBoard from './ClipBoard.js'

export const __initialize__ = () => {
  Command.register('ClipBoard.readFiles', ClipBoard.readFiles)
  Command.register('ClipBoard.writeFiles', ClipBoard.writeFiles)
}
