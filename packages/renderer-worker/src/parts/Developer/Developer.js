import * as ColorTheme from '../ColorTheme/ColorTheme.js'
import * as Command from '../Command/Command.js'
import * as ElectronDeveloper from '../ElectronDeveloper/ElectronDeveloper.js'
import * as FormatStartupPerformance from '../FormatStartupPerformance/FormatStartupPerformance.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Performance from '../Performance/Performance.js'
import * as PerformanceEntryType from '../PerformanceEntryType/PerformanceEntryType.js'
import * as OpenUri from '../OpenUri/OpenUri.js'
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

const getNodeTiming = () => {
  if (Platform.getPlatform() === PlatformType.Web) {
    return undefined
  }
  return SharedProcess.invoke(/* command */ 'Performance.getNodeStartupTiming')
}

const getMeasureEntries = () => {
  const measureEntries = Performance.getEntriesByType(PerformanceEntryType.Measure)
  const timeOrigin = Performance.timeOrigin
  return {
    entries: measureEntries,
    timeOrigin,
  }
}

const getElectronEntries = async () => {
  if (Platform.getPlatform() === PlatformType.Web || Platform.getPlatform() === PlatformType.Remote) {
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
  if (Platform.getPlatform() !== PlatformType.Web) {
    nodeStartupTiming = await getNodeTiming()
  }
  const measureEntries = getMeasureEntries()
  let electronEntries
  if (Platform.getPlatform() === PlatformType.Electron) {
    electronEntries = await getElectronEntries()
  }
  const text = FormatStartupPerformance.formatStartupPerformance({
    nodeStartupTiming,
    measureEntries,
    electronEntries,
  })
  return text
}

export const showStartupPerformance = async () => {
  await OpenUri.openUri('app://startup-performance')
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
  const totalSent = 0
  const totalReceived = 0
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

export const showMemoryUsage = async () => {
  await OpenUri.openUri('app://memory-usage')
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

export const reloadIconTheme = async (platform, assetDir) => {
  await IconTheme.hydrate(platform, assetDir)
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

export const openStorageOverview = async () => {
  await OpenUri.openUri('storage-overview://')
}

export const openBrowserViewOverview = async () => {
  await OpenUri.openUri('browser-view-overview://')
}

export const openScreenCastView = async () => {
  await OpenUri.openUri('screen-cast://')
}

export const openIframeInspector = async () => {
  await OpenUri.openUri('iframe-inspector://')
}
