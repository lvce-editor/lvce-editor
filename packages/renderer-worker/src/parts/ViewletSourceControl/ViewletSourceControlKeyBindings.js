import * as SourceControlWorker from '../SourceControlWorker/SourceControlWorker.js'

export const getKeyBindings = async () => {
  try {
    return await SourceControlWorker.invoke('SourceControl.getKeyBindings')
  } catch {
    return []
  }
}
