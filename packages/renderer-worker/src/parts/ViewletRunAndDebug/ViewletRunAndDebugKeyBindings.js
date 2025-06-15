import * as DebugWorker from '../DebugWorker/DebugWorker.js'

export const getKeyBindings = () => {
  return DebugWorker.invoke('RunAndDebug.getKeyBindings')
}
