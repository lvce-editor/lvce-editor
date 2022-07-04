import * as Command from '../Command/Command.js'
import * as EditorDiagnostics from './EditorDiagnostics.js'

export const __initialize__ = () => {
  Command.register('EditorDiagnostics.hydrate', EditorDiagnostics.hydrate)
}
