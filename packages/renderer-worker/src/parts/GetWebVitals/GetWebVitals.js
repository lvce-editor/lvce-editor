import * as Performance from '../Performance/Performance.js'
import * as PerformanceEntryType from '../PerformanceEntryType/PerformanceEntryType.js'

export const getWebVitals = async () => {
  let firstPaint = -1
  let firstContentfulPaint = -1
  let largestContentfulPaint = -1
  const paintEntries = Performance.getEntriesByType(PerformanceEntryType.Paint)
  for (const paintEntry of paintEntries) {
    switch (paintEntry.name) {
      case 'first-paint':
        firstPaint = paintEntry.startTime
        break
      case 'first-contentful-paint':
        firstContentfulPaint = paintEntry.startTime
        break
    }
  }
  const performanceObserver = new PerformanceObserver(() => {})
  performanceObserver.observe({
    type: 'largest-contentful-paint',
    buffered: true,
  })
  const records = performanceObserver.takeRecords()
  performanceObserver.disconnect()
  if (records.length > 0) {
    largestContentfulPaint = records[0].startTime
  }

  return [
    {
      name: 'first-paint',
      startTime: firstPaint,
    },
    {
      name: 'firstContentfulPaint',
      startTime: firstContentfulPaint,
    },
    {
      name: 'largestContentfulPaint',
      startTime: largestContentfulPaint,
    },
  ]
}
