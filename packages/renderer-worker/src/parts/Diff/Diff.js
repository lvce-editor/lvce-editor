// Based on https://johnresig.com/projects/javascript-diff-algorithm/ by John Resig (License MIT)

const makeMap = (linesA, linesB) => {
  const map = Object.create(null)
  // pass one
  const na = []
  for (let i = 0; i < linesB.length; i++) {
    const line = linesB[i]
    if (line in map) {
      map[line].nc++
    } else {
      map[line] = {
        oc: 0,
        nc: 1,
        olno: -1,
      }
    }
    na.push(map[line])
  }
  // pass two
  const oa = []
  for (let i = 0; i < linesA.length; i++) {
    const line = linesA[i]
    if (line in map) {
      map[line].oc++
    } else {
      map[line] = {
        oc: 1,
        nc: 0,
        olno: 0,
      }
    }
    map[line].olno = i
    oa.push(map[line])
  }
  return {
    map,
    oa,
    na,
  }
}

/**
 *
 * @param {string[]} linesA
 * @param {string[]} linesB
 * @returns
 */
export const diff = (linesA, linesB) => {
  // create hashmaps of which line corresponds to which indices
  const { map, oa, na } = makeMap(linesA, linesB)

  map

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

  oa
  na

  const changesRight = []
  const changesLeft = []

  for (let i = 0; i < na.length; i++) {
    const j = na[i]
    if (typeof j === 'number') {
      // stayed the same
    } else {
      changesRight.push({ type: 'insert', index: i })
    }
  }

  for (let i = 0; i < oa.length; i++) {
    const j = oa[i]
    if (typeof j === 'number') {
      // stayed the same
    } else {
      changesLeft.push({ type: 'delete', index: i })
    }
  }

  return { changesLeft, changesRight }
}

const linesA = ['a', 'd']
const linesB = ['a', 'b', 'c']
diff(linesA, linesB) //?
