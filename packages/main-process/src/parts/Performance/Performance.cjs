exports.mark = (key) => {
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
  const entries = performance.getEntries()
  const uiEntries = entries.map(toUiEntry)
  return uiEntries
}

exports.clearMarks = () => {
  performance.clearMarks()
}

exports.timeOrigin = performance.timeOrigin
