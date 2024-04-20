// Based on https://johnresig.com/projects/javascript-diff-algorithm/ by John Resig (License MIT)

export const makeDiffMap = (linesA, linesB) => {
  const map = Object.create(null)
  // pass one
  const na: any[] = []
  for (const line of linesB) {
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
  const oa: any[] = []
  for (const [i, line] of linesA.entries()) {
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
