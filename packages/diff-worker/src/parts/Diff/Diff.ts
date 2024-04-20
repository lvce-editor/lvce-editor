// Based on https://johnresig.com/projects/javascript-diff-algorithm/ by John Resig (License MIT)

import * as DiffType from '../DiffType/DiffType.ts'
import * as MakeDiffMap from '../MakeDiffMap/MakeDiffMap.ts'

/**
 *
 * @param {string[]} linesA
 * @param {string[]} linesB
 * @returns
 */
export const diff = (linesA: string[], linesB: string[]) => {
  // create hashmaps of which line corresponds to which indices
  const { oa, na } = MakeDiffMap.makeDiffMap(linesA, linesB)

  // pass 3
  for (let i = 0; i < na.length; i++) {
    const entry = na[i]
    if (entry.nc === 1 && entry.oc === 1) {
      na[i] = entry.olno
      oa[entry.olno] = i
    }
  }

  // pass 4
  for (let i = 0; i < na.length - 1; i++) {
    const j = na[i]
    if (typeof j === 'number' && na[i + 1] === oa[j + 1]) {
      oa[j + 1] = i + 1
      na[i + 1] = j + 1
    }
  }

  // pass 5
  for (let i = na.length; i > 0; i--) {
    const j = na[i]
    if (typeof j === 'number' && na[i - 1] === oa[j - 1]) {
      na[i - 1] = j - 1
      oa[j - 1] = i - 1
    }
  }

  const changesRight: any[] = []
  const changesLeft: any[] = []

  for (let i = 0; i < na.length; i++) {
    const j = na[i]
    if (typeof j === 'number') {
      // stayed the same
    } else {
      changesRight.push({ type: DiffType.Insertion, index: i })
    }
  }

  for (let i = 0; i < oa.length; i++) {
    const j = oa[i]
    if (typeof j === 'number') {
      // stayed the same
    } else {
      changesLeft.push({ type: DiffType.Deletion, index: i })
    }
  }

  return { changesLeft, changesRight }
}
