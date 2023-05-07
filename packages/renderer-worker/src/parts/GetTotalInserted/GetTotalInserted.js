export const getTotalInserted = (dom, start, childCount = dom[start].childCount) => {
  let total = 0
  let pending = 0
  for (let i = start; i < dom.length; i++) {
    const element = dom[i]
    total++
    pending += element.childCount
    if (total === pending + 1) {
      break
    }
  }
  return total
}
