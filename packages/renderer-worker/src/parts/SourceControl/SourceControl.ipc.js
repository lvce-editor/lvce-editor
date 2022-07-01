import * as Command from '../Command/Command.js'
import * as SourceControl from './SourceControl.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('SourceControl.updateDecorations', SourceControl.updateDecorations)
}
