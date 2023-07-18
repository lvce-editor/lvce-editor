import * as ToMarkdownTable from '../ToMarkdownTable/ToMarkdownTable.js'

const hasEmptyDuration = (entry) => {
  return entry.duration === 0
}

const formatStartupPerformanceEntriesWithoutDuration = (entries, firstTimeOrigin) => {
  const diff = entries.timeOrigin - firstTimeOrigin
  const header = ['Name', 'Start Time']
  const formatEntry = (entry) => {
    const name = entry.name
    if (!name) {
      return ['n/a', 'n/a']
    }
    const startTime = `${(entry.startTime + diff).toFixed(2)}ms`
    return [name, startTime]
  }
  const rows = entries.entries.map(formatEntry)
  return ToMarkdownTable.toMarkdownTable(header, rows)
}

const formatStartupPerformanceEntriesWithDuration = (entries, firstTimeOrigin) => {
  const diff = entries.timeOrigin - firstTimeOrigin
  const header = ['Name', 'Start Time', 'Duration']
  const formatEntry = (entry) => {
    const name = entry.name
    if (!name) {
      return ['n/a', 'n/a', 'n/a']
    }
    const startTime = `${(entry.startTime + diff).toFixed(2)}ms`
    const duration = `${entry.duration.toFixed(2)}ms`
    return [name, startTime, duration]
  }
  const rows = entries.entries.map(formatEntry)
  return ToMarkdownTable.toMarkdownTable(header, rows)
}

export const formatStartupPerformanceEntries = (entries, firstTimeOrigin) => {
  if (entries.entries.every(hasEmptyDuration)) {
    return formatStartupPerformanceEntriesWithoutDuration(entries, firstTimeOrigin)
  }
  return formatStartupPerformanceEntriesWithDuration(entries, firstTimeOrigin)
}
