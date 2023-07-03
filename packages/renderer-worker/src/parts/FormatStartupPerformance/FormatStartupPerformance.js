import * as JoinLines from '../JoinLines/JoinLines.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as ToMarkdownTable from '../ToMarkdownTable/ToMarkdownTable.js'

const formatStartupPerformanceEntries = (entries, firstTimeOrigin) => {
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

const formatWebVitals = (vitals) => {
  const header = ['Name', 'Start Time']
  const rows = vitals.map((entry) => {
    const name = entry.name
    const startTime = `${entry.startTime.toFixed(2)}ms`
    return [name, startTime]
  })
  return toMarkdownTable(header, rows)
}

const formatNodeTiming = (nodeStartupTiming) => {
  const header = ['Name', 'Value']
  const rows = Object.entries(nodeStartupTiming).map(([key, value]) => {
    if (typeof value === 'number' && value > 0) {
      return [key, `${value.toFixed(2)}ms`]
    }
    return [key, `${value}`]
  })
  return toMarkdownTable(header, rows)
}

const getFirstTimeOrigin = ({ measureEntries, electronEntries }) => {
  if (electronEntries) {
    return electronEntries.timeOrigin
  }
  if (measureEntries) {
    return measureEntries.timeOrigin
  }
  return 0
}

export const formatStartupPerformance = ({ measureEntries, webVitals, nodeStartupTiming, electronEntries }) => {
  const firstTimeOrigin = getFirstTimeOrigin({
    measureEntries,
    electronEntries,
  })
  const lines = []
  lines.push('# Startup Performance')
  lines.push('')
  if (electronEntries) {
    const formattedElectronEntries = formatStartupPerformanceEntries(electronEntries, firstTimeOrigin)
    lines.push('## main-process')
    lines.push('')
    lines.push(...SplitLines.splitLines(formattedElectronEntries))
    lines.push('')
  }
  if (measureEntries) {
    const formattedMeasureEntries = formatStartupPerformanceEntries(measureEntries, firstTimeOrigin)
    if (electronEntries) {
      const deltaTimeOrigin = (measureEntries.timeOrigin - electronEntries.timeOrigin).toFixed(2)
      lines.push(`## renderer-worker (+${deltaTimeOrigin}ms)`)
    } else {
      lines.push('## renderer-worker')
    }
    lines.push('')
    lines.push(...SplitLines.splitLines(formattedMeasureEntries))
    lines.push('')
  }
  if (webVitals) {
    const formattedWebVitals = formatWebVitals(webVitals)
    lines.push('## Web Vitals')
    lines.push('')
    lines.push(...SplitLines.splitLines(formattedWebVitals))
    lines.push('')
  }
  if (nodeStartupTiming) {
    const formattedNodeStartupTiming = formatNodeTiming(nodeStartupTiming)
    lines.push('## Node Startup Timing')
    lines.push('')
    lines.push(...SplitLines.splitLines(formattedNodeStartupTiming))
    lines.push('')
  }
  lines.push('## Extension Host')
  lines.push('')
  const content = JoinLines.joinLines(lines)
  return content
}
