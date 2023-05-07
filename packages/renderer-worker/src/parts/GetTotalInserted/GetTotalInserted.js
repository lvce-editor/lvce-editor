import { div } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getTotalInserted = (dom, start, childCount = dom[start].childCount) => {
  let count = 0
  // getTotalInserted(dom, i,)
  let current = 0
  let total = 0
  let pending = 0
  for (let i = start; i < dom.length; i++) {
    console.log({ childCount })
    childCount //?
    const element = dom[i]
    total++
    pending += element.childCount
    if (total === pending + 1) {
      break
    }
    // total += element.childCount
    // current -= element.childCount
    // console.log({ current })
    // if (current === 0) {
    // break
    // }
    // total++
    // current++
  }
  return total
}
