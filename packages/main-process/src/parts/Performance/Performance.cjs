exports.mark = (key) => {
  // @ts-ignore
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

exports.getEntries = () => {
  // @ts-ignore
  const entries = performance.getEntries()
  const uiEntries = entries.map(toUiEntry)
  return uiEntries
}

exports.clearMarks = () => {
  // @ts-ignore
  performance.clearMarks()
}

// @ts-ignore
exports.timeOrigin = performance.timeOrigin
