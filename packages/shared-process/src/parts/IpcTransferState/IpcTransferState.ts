const pendingCount = Object.create(null)

export const add = (ipcId) => {
  pendingCount[ipcId] ||= 0
  pendingCount[ipcId]++
}

export const remove = (ipcId) => {
  pendingCount[ipcId]--
  if (pendingCount[ipcId] === 0) {
    delete pendingCount[ipcId]
  }
}

export const has = (ipcId) => {
  return ipcId in pendingCount
}
