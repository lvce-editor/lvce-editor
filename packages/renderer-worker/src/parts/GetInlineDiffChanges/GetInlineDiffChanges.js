import * as DiffWorker from '../DiffWorker/DiffWorker.js'

export const getInlineDiffChanges = (linesLeft, linesRight) => {
  return DiffWorker.invoke('Diff.diffInline', linesLeft, linesRight)
}
