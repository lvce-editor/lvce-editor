import * as DiffWorker from '../DiffWorker/DiffWorker.js'

/**
 *
 * @param {string[]} linesA
 * @param {string[]} linesB
 * @returns
 */
export const diff = (linesA, linesB) => {
  return DiffWorker.invoke('Diff.diff', linesA, linesB)
}
