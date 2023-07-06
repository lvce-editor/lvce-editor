import * as ColorTheme from '../ColorTheme/ColorTheme.js'
import * as Command from '../Command/Command.js'
import * as ElectronDeveloper from '../ElectronDeveloper/ElectronDeveloper.js'
import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as FormatStartupPerformance from '../FormatStartupPerformance/FormatStartupPerformance.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as PrettyBytes from '../PrettyBytes/PrettyBytes.js'
import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as ToMarkdownTable from '../ToMarkdownTable/ToMarkdownTable.js'
// TODO vscode's version of this is shorter
// if it is a bottleneck, check performance of this function (not very optimized now)

// TODO no export, this is internal only

const getWebVitals = async () => {
  let firstPaint = -1
  let firstContentfulPaint = -1
  let largestContentfulPaint = -1
  const paintEntries = performance.getEntriesByType('paint')
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

const getNodeTiming = () => {
  if (Platform.platform === PlatformType.Web) {
    return undefined
  }
  return SharedProcess.invoke(/* command */ 'Developer.getNodeStartupTime')
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

const getMeasureEntries = () => {
  const measureEntries = performance.getEntriesByType('measure')
  const timeOrigin = performance.timeOrigin
  return {
    entries: measureEntries,
    timeOrigin,
  }
}

const getElectronEntries = async () => {
  if (Platform.platform === PlatformType.Web || Platform.platform === PlatformType.Remote) {
    return undefined
  }
  const result = await ElectronDeveloper.getPerformanceEntries()
  return result
}

// TODO should open file perf://startup-performance -> calls fs provider -> provides statistics
// that would work well for restoring editor
export const getStartupPerformanceContent = async () => {
  // TODO how to update content once workbench startup has finished?
  // await new Promise((resolve) =>
  //   LifeCycle.once(LifeCycle.PHASE_FIFTEEN, resolve)
  // )
  let nodeStartupTiming
  if (Platform.platform !== PlatformType.Web) {
    nodeStartupTiming = await getNodeTiming()
  }
  const measureEntries = getMeasureEntries()
  const webVitals = await getWebVitals()
  let electronEntries
  if (Platform.platform === 'electron') {
    electronEntries = await getElectronEntries()
  }
  const text = FormatStartupPerformance.formatStartupPerformance({
    nodeStartupTiming,
    measureEntries,
    webVitals,
    electronEntries,
  })
  return text
}

export const showStartupPerformance = async () => {
  await Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ 'app://startup-performance')
}

const formatNodeMemoryUsage = (memoryUsage) => {
  if (!memoryUsage) {
    return ['']
  }
  const header = ['Name', 'Memory']
  const rows = Object.entries(memoryUsage).map(([key, value]) => {
    return [key, PrettyBytes.formatBytes(value)]
  })
  return ToMarkdownTable.toMarkdownTable(header, rows)
}

const formatRendererWorkerData = ({ userAgentSpecificMemory, sent, received }) => {
  let content = ''
  if (userAgentSpecificMemory) {
    const header = ['Name', 'Value']
    const rows = []
    if (userAgentSpecificMemory.bytes) {
      rows.push(['Bytes', PrettyBytes.formatBytes(userAgentSpecificMemory.bytes)])
    }
    if (userAgentSpecificMemory.breakdown) {
      for (const item of userAgentSpecificMemory.breakdown) {
        if (!item.bytes) {
          continue
        }
        rows.push([item.types[0] || 'n/a', PrettyBytes.formatBytes(item.bytes)])
      }
    }
    content += ToMarkdownTable.toMarkdownTable(header, rows)
  }
  return content
}

const formatRendererProcessData = ({ memoryUsage }) => {
  if (!memoryUsage) {
    return 'No Information available.'
  }
  const header = ['Name', 'Value']
  const rows = [
    ['jsHeapSizeLimit', PrettyBytes.formatBytes(memoryUsage.jsHeapSizeLimit)],
    ['Total JS HeapSize', PrettyBytes.formatBytes(memoryUsage.totalJSHeapSize)],
    ['Used JS HeapSize', PrettyBytes.formatBytes(memoryUsage.usedJSHeapSize)],
  ]
  return ToMarkdownTable.toMarkdownTable(header, rows)
}

const getSharedProcessMemoryUsage = () => {
  return SharedProcess.invoke(/* Developer.sharedProcessMemoryUsage */ 'Developer.sharedProcessMemoryUsage')
}

const getPerformanceMemory = () => {
  return RendererProcess.invoke('Performance.getMemory')
}

const getPerformanceUserAgentSpecificMemory = () => {
  return RendererProcess.invoke('Performance.measureUserAgentSpecificMemory')
}

// TODO handle case when renderer process and renderer worker are same process communicating via messagePort
export const getMemoryUsageContent = async () => {
  const sharedProcessMemoryUsage = await getSharedProcessMemoryUsage()
  const formattedSharedProcessMemoryUsage = formatNodeMemoryUsage(sharedProcessMemoryUsage)
  const userAgentSpecificMemory = await getPerformanceUserAgentSpecificMemory()
  const totalSent = SharedProcess.state.totalSent
  const totalReceived = SharedProcess.state.totalReceived
  const formattedRendererWorkerMemoryUsage = formatRendererWorkerData({
    userAgentSpecificMemory,
    sent: totalSent,
    received: totalReceived,
  })
  const rendererProcessMemoryUsage = await getPerformanceMemory()
  const formattedRendererProcessMemoryUsage = formatRendererProcessData({
    memoryUsage: rendererProcessMemoryUsage,
  })

  const isWorker = typeof WorkerGlobalScope !== 'undefined'
  console.log({ isWorker, rendererWorkerMemoryUsage: userAgentSpecificMemory })
  const text = isWorker
    ? `## Shared Process

${formattedSharedProcessMemoryUsage}


## Renderer Worker

${formattedRendererWorkerMemoryUsage}

## Renderer Process

${formattedRendererProcessMemoryUsage}
`
    : `## Renderer Worker / Renderer Process

${formattedRendererWorkerMemoryUsage}

## Shared Process

${formattedSharedProcessMemoryUsage}

`
  return text
}

export const showMemoryUsage = () => {
  return Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ 'app://memory-usage')
}

// TODO not sure if this function is useful
export const allocateMemoryInSharedProcess = () => {
  return SharedProcess.invoke(/* Developer.allocateMemoryInSharedProcess */ 'Developer.allocateMemoryInSharedProcess')
}

export const openExtensionsFolder = () => {
  // TODO only possible in local file system
}

export const createSharedProcessHeapSnapshot = async () => {
  await SharedProcess.invoke(/* Developer.createSharedProcessHeapSnapshot */ 'Developer.createSharedProcessHeapSnapshot')
}

export const createSharedProcessProfile = async () => {
  await SharedProcess.invoke(/* Developer.createProfile */ 'Developer.createProfile')
}

export const showIconThemeCss = async () => {
  // const iconThemeCss = await IconTheme.getIconThemeCss()
  // Main.openRawText('css://icon-theme.css', iconThemeCss)
}

export const reloadIconTheme = async () => {
  await IconTheme.hydrate()
}

export const reloadColorTheme = async () => {
  await ColorTheme.hydrate()
}

export const showColorThemeCss = async () => {
  // @ts-ignore
  const colorThemeCss = await ColorTheme.getColorThemeCssCacheFirst()
  // @ts-ignore
  Main.openRawText('css://color-theme.css', colorThemeCss)
}

export const clearCache = async () => {
  await Command.execute(/* CacheStorage.clearCache */ 'CacheStorage.clearCache')
  await Command.execute(/* LocalStorage.clear */ 'LocalStorage.clear')
  await Command.execute(/* SessionStorage.clear */ 'SessionStorage.clear')
}

export const editors = {
  'performance://monitor': {},
  'performance://startup': {},
}

export const showMessageBox = () => {}

export const openProcessExplorer = () => {
  return ProcessExplorer.open()
}

export const downloadViewletState = async () => {
  const states = await Command.execute('Viewlet.getAllStates')
  await Command.execute('Download.downloadJson', /* json */ states, /* fileName */ 'viewlets.json')
}

export const openBrowserViewOverview = async () => {
  await Command.execute('Main.openUri', 'browser-view-overview://')
}

export const openScreenCastView = async () => {
  await Command.execute('Main.openUri', 'screen-cast://')
}
