import * as Command from '../Command/Command.js'
import * as SourceControl from './SourceControl.js'

export const __initialize__ = () => {
  Command.register(1300, SourceControl.updateDecorations)
}
