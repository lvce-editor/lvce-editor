export const mark = (key) => {
  performance.mark(key)
}

const toUiEntry = (performanceEntry) => {
  return {
    name: performanceEntry.name,
    entryType: performanceEntry.entryType,
    startTime: performanceEntry.startTime,
    duration: performanceEntry.duration,
    detail: performanceEntry.detail,
  }
}

export const getEntries = () => {
  const entries = performance.getEntries()
  const uiEntries = entries.map(toUiEntry)
  return uiEntries
}

export const clearMarks = () => {
  performance.clearMarks()
}

export const { timeOrigin } = performance
