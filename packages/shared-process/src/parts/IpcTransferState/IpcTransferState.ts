const pendingCount = Object.create(null)

export const add = (ipcId: any): any => {
  pendingCount[ipcId] ||= 0
  pendingCount[ipcId]++
}

export const remove = (ipcId: any): any => {
  pendingCount[ipcId]--
  if (pendingCount[ipcId] === 0) {
    delete pendingCount[ipcId]
  }
}

export const has = (ipcId: any): any => {
  return ipcId in pendingCount
}
