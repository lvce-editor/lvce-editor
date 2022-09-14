import prettyBytes from '../../../../../static/js/pretty-bytes.js'
import * as ColorTheme from '../ColorTheme/ColorTheme.js'
import * as Command from '../Command/Command.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as ElectronWindowProcessExplorer from '../ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const formatBytes = (bytes) => {
  return prettyBytes(bytes)
}

// TODO vscode's version of this is shorter
// if it is a bottleneck, check performance of this function (not very optimized now)

// TODO no export, this is internal only
const toMarkdownTable = (header, rows) => {
  const numberOfColumns = header.length
  const numberOfRows = rows.length
  const maxLengths = [...new Array(numberOfColumns).fill(0)]
  for (let i = 0; i < numberOfColumns; i++) {
    maxLengths[i] = header[i].length
    for (let j = 0; j < numberOfRows; j++) {
      maxLengths[i] = Math.max(maxLengths[i], rows[j][i].length)
    }
  }
  let result = ''
  for (let i = 0; i < numberOfColumns; i++) {
    result += '|'
    result += ' '
    result += header[i]
    result += ' '.repeat(maxLengths[i] - header[i].length)
    result += ' '
  }
  result += '|\n'
  for (let i = 0; i < numberOfColumns; i++) {
    result += '|'
    result += '-'.repeat(maxLengths[i] + 2)
  }
  result += '|\n'
  for (const row of rows) {
    for (let i = 0; i < numberOfColumns; i++) {
      result += '|'
      result += ' '
      result += row[i]
      result += ' '.repeat(maxLengths[i] - row[i].length)
      result += ' '
    }
    result += '|\n'
  }
  return result
}

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
  return toMarkdownTable(header, rows)
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

const formatStartupPerformance = ({
  measureEntries,
  webVitals,
  nodeStartupTiming,
  electronEntries,
}) => {
  const firstTimeOrigin = getFirstTimeOrigin({
    measureEntries,
    electronEntries,
  })
  const lines = []
  lines.push('# Startup Performance')
  lines.push('')
  if (electronEntries) {
    const formattedElectronEntries = formatStartupPerformanceEntries(
      electronEntries,
      firstTimeOrigin
    )
    lines.push('## main-process')
    lines.push('')
    lines.push(...formattedElectronEntries.split('\n'))
    lines.push('')
  }
  if (measureEntries) {
    const formattedMeasureEntries = formatStartupPerformanceEntries(
      measureEntries,
      firstTimeOrigin
    )
    if (electronEntries) {
      const deltaTimeOrigin = (
        measureEntries.timeOrigin - electronEntries.timeOrigin
      ).toFixed(2)
      lines.push(`## renderer-worker (+${deltaTimeOrigin}ms)`)
    } else {
      lines.push('## renderer-worker')
    }
    lines.push('')
    lines.push(...formattedMeasureEntries.split('\n'))
    lines.push('')
  }
  if (webVitals) {
    const formattedWebVitals = formatWebVitals(webVitals)
    lines.push('## Web Vitals')
    lines.push('')
    lines.push(...formattedWebVitals.split('\n'))
    lines.push('')
  }
  if (nodeStartupTiming) {
    const formattedNodeStartupTiming = formatNodeTiming(nodeStartupTiming)
    lines.push('## Node Startup Timing')
    lines.push('')
    lines.push(...formattedNodeStartupTiming.split('\n'))
    lines.push('')
  }
  lines.push('## Extension Host')
  lines.push('')
  const content = lines.join('\n')
  return content
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
  if (
    Platform.platform === PlatformType.Web ||
    Platform.platform === PlatformType.Remote
  ) {
    return undefined
  }
  const result = await SharedProcess.invoke(
    /* Electron.getPerformanceEntries */ 'Electron.getPerformanceEntries'
  )
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
  const text = formatStartupPerformance({
    nodeStartupTiming,
    measureEntries,
    webVitals,
    electronEntries,
  })
  return text
}

export const showStartupPerformance = async () => {
  await Command.execute(
    /* Main.openUri */ 'Main.openUri',
    /* uri */ 'app://startup-performance'
  )
}

const formatNodeMemoryUsage = (memoryUsage) => {
  if (!memoryUsage) {
    return ['']
  }
  const header = ['Name', 'Memory']
  const rows = Object.entries(memoryUsage).map(([key, value]) => {
    return [key, formatBytes(value)]
  })
  return toMarkdownTable(header, rows)
}

const formatRendererWorkerData = ({
  memory,
  userAgentSpecificMemory,
  sent,
  received,
}) => {
  let content = ''
  if (userAgentSpecificMemory) {
    const header = ['Name', 'Value']
    const rows = []
    if (userAgentSpecificMemory.bytes) {
      rows.push(['Bytes', formatBytes(userAgentSpecificMemory.bytes)])
    }
    if (userAgentSpecificMemory.breakdown) {
      for (const item of userAgentSpecificMemory.breakdown) {
        if (!item.bytes) {
          continue
        }
        rows.push([item.types[0] || 'n/a', formatBytes(item.bytes)])
      }
    }
    content += toMarkdownTable(header, rows)
  } else if (memory) {
    const header = ['Name', 'Value']
    const rows = [
      ['jsHeapSizeLimit', formatBytes(memory.jsHeapSizeLimit)],
      ['Total JS HeapSize', formatBytes(memory.totalJSHeapSize)],
      ['Used JS HeapSize', formatBytes(memory.usedJSHeapSize)],
      ['Sent', formatBytes(sent)],
      ['Received', formatBytes(received)],
    ]
    content += toMarkdownTable(header, rows)
  }
  return content
}

const formatRendererProcessData = ({ memoryUsage }) => {
  if (!memoryUsage) {
    return 'No Information available.'
  }
  const header = ['Name', 'Value']
  const rows = [
    ['jsHeapSizeLimit', formatBytes(memoryUsage.jsHeapSizeLimit)],
    ['Total JS HeapSize', formatBytes(memoryUsage.totalJSHeapSize)],
    ['Used JS HeapSize', formatBytes(memoryUsage.usedJSHeapSize)],
  ]
  return toMarkdownTable(header, rows)
}

const getRendererWorkerMemoryUsage = async () => {
  let userAgentSpecificMemory
  let memory
  // @ts-ignore
  if (performance && performance.memory) {
    // @ts-ignore
    memory = performance.memory
  }
  // @ts-ignore
  if (performance && performance.measureUserAgentSpecificMemory) {
    // @ts-ignore
    userAgentSpecificMemory = await performance.measureUserAgentSpecificMemory()
  }
  return {
    memory,
    userAgentSpecificMemory,
  }
}

const getSharedProcessMemoryUsage = () => {
  return SharedProcess.invoke(
    /* Developer.sharedProcessMemoryUsage */ 'Developer.sharedProcessMemoryUsage'
  )
}

const getRendererProcessMemoryUsage = async () => {
  const memoryUsage = await RendererProcess.invoke(
    /* Developer.getMemoryUsage */ 284
  )
  return memoryUsage
}

const getExtensionHostMemoryUsage = async () => {
  return SharedProcess.invoke(
    /* ExtensionHost.getMemoryUsage */ 'ExtensionHost.getMemoryUsage'
  )
}

// TODO handle case when renderer process and renderer worker are same process communicating via messagePort
export const getMemoryUsageContent = async () => {
  const sharedProcessMemoryUsage = await getSharedProcessMemoryUsage()
  const formattedSharedProcessMemoryUsage = formatNodeMemoryUsage(
    sharedProcessMemoryUsage
  )
  const extensionHostMemoryUsage = await getExtensionHostMemoryUsage()
  const formattedExtensionHostMemoryUsage = formatNodeMemoryUsage(
    extensionHostMemoryUsage
  )
  const rendererWorkerMemoryUsage = await getRendererWorkerMemoryUsage()
  const totalSent = SharedProcess.state.totalSent
  const totalReceived = SharedProcess.state.totalReceived
  const formattedRendererWorkerMemoryUsage = formatRendererWorkerData({
    memory: rendererWorkerMemoryUsage.memory,
    userAgentSpecificMemory: rendererWorkerMemoryUsage.userAgentSpecificMemory,
    sent: totalSent,
    received: totalReceived,
  })
  const rendererProcessMemoryUsage = await getRendererProcessMemoryUsage()
  const formattedRendererProcessMemoryUsage = formatRendererProcessData({
    memoryUsage: rendererProcessMemoryUsage,
  })

  const isWorker = typeof WorkerGlobalScope !== 'undefined'
  const text = isWorker
    ? `## Shared Process

${formattedSharedProcessMemoryUsage}

## Extension Host

${formattedExtensionHostMemoryUsage}

## Renderer Worker

${formattedRendererWorkerMemoryUsage}

## Renderer Process

${formattedRendererProcessMemoryUsage}
`
    : `## Renderer Worker / Renderer Process

${formattedRendererWorkerMemoryUsage}

## Shared Process

${formattedSharedProcessMemoryUsage}

## Extension Host

${formattedExtensionHostMemoryUsage}


`
  return text
}

export const showMemoryUsage = async () => {
  await Command.execute(
    /* Main.openUri */ 'Main.openUri',
    /* uri */ 'app://memory-usage'
  )
}

// TODO not sure if this function is useful
export const allocateMemoryInSharedProcess = async () => {
  await SharedProcess.invoke(
    /* Developer.allocateMemoryInSharedProcess */ 'Developer.allocateMemoryInSharedProcess'
  )
}

export const crashSharedProcess = async () => {
  await SharedProcess.invoke(
    /* Developer.crashSharedProcess */ 'Developer.crashSharedProcess'
  )
}

export const crashRendererProcess = () => {}

export const crashRendererWorker = () => {}

export const crashMainProcess = async () => {
  await SharedProcess.invoke(
    /* Electron.crashMainProcess */ 'Electron.crashMainProcess'
  )
}

export const openExtensionsFolder = () => {
  // TODO only possible in local file system
}

export const openLogsFolder = async () => {
  // TODO only in electron or in remote when it is the same machine
  if (Platform.platform === PlatformType.Web) {
    return
  }
  const logsFolder = await Platform.getLogsDir()
  await Command.execute(
    /* OpenNativeFolder.openNativeFolder */ 'OpenNativeFolder.openNativeFolder',
    /* path */ logsFolder
  )
}

export const toggleDeveloperTools = () => {
  return ElectronWindow.toggleDevtools()
}

export const showIconThemeCss = async () => {
  // const iconThemeCss = await IconTheme.getIconThemeCss()
  // Main.openRawText('css://icon-theme.css', iconThemeCss)
}

export const createSharedProcessHeapSnapshot = async () => {
  await SharedProcess.invoke(
    /* Developer.createSharedProcessHeapSnapshot */ 'Developer.createSharedProcessHeapSnapshot'
  )
}

export const createSharedProcessProfile = async () => {
  await SharedProcess.invoke(
    /* Developer.createProfile */ 'Developer.createProfile'
  )
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

export const openConfigFolder = async () => {
  const configFolder = await Platform.getConfigPath()
  await Command.execute(
    /* OpenNativeFolder.openNativeFolder */ 'OpenNativeFolder.openNativeFolder',
    /* path */ configFolder
  )
}

export const openCacheFolder = async () => {
  const cacheFolder = await Platform.getCachePath()
  await Command.execute(
    /* OpenNativeFolder.openNativeFolder */ 'OpenNativeFolder.openNativeFolder',
    /* path */ cacheFolder
  )
}

export const openDataFolder = async () => {
  const dataFolder = await SharedProcess.invoke(
    /* Platform.getDataDir */ 'Platform.getDataDir'
  )
  await Command.execute(
    /* OpenNativeFolder.openNativeFolder */ 'OpenNativeFolder.openNativeFolder',
    /* path */ dataFolder
  )
}

export const showMessageBox = () => {}

const openProcessExplorerElectron = () => {
  return ElectronWindowProcessExplorer.open()
}

const openProcessExplorerRemote = () => {
  throw new Error('not implemented')
}

const openProcessExplorerWeb = () => {
  throw new Error('not implemented')
}

export const openProcessExplorer = () => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return openProcessExplorerElectron()
    case PlatformType.Remote:
      return openProcessExplorerRemote()
    case PlatformType.Web:
      return openProcessExplorerWeb()
  }
}

export const downloadViewletState = async () => {
  const states = await Command.execute('Viewlet.getAllStates')
  await Command.execute(
    'Download.downloadJson',
    /* json */ states,
    /* fileName */ 'viewlets.json'
  )
}
