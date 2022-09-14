import * as ChildWindow from '../ChildWindow/ChildWindow.js'
import * as Id from '../Id/Id.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as PrettyBytes from '../PrettyBytes/PrettyBytes.js'

const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=600,height=300`
const processExplorerUrl = '/process-explorer/index.html'
const windowTarget = '_blank'

export const state = {
  windowIds: Object.create(null),
}

const formatBytes = (bytes) => {
  if (bytes < 1000) {
    return `${bytes}B`
  }
}

const formatMemoryUsage = (memoryUsage) => {
  if (!memoryUsage) {
    return 'n/a'
  }
  const { usedJSHeapSize } = memoryUsage
  const formattedUsedJsHeapSize = PrettyBytes.formatBytes(usedJSHeapSize)
  return `renderer-process: used js heap size ${formattedUsedJsHeapSize}`
}

export const open = async () => {
  const windowId = Id.create()
  await ChildWindow.open(windowId, processExplorerUrl, windowTarget, params)
  // const memory = performance.memory
  setInterval(async () => {
    const memoryUsage = await RendererProcess.invoke('Developer.getMemoryUsage')
    const formattedMemoryUsage = formatMemoryUsage(memoryUsage)
    await ChildWindow.postMessage(windowId, formattedMemoryUsage)
  }, 1000)
}
