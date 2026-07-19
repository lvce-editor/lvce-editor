import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as TestWorker from '../TestWorker/TestWorker.js'
import * as TestWorkerUrl from '../TestWorkerUrl/TestWorkerUrl.js'

const createTestWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.testWorkerPath', TestWorkerUrl.testWorkerUrl)
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Test Worker',
  })
  HandleIpc.handleIpc(ipc)
  TestWorker.set(ipc)
  return ipc
}

let launchPromise: ReturnType<typeof createTestWorker> | undefined

const getOrCreateLaunchPromise = () => {
  if (!launchPromise) {
    launchPromise = createTestWorker()
  }
  return launchPromise
}

const shouldPreloadTestWorker = (href: string, isPromptMode: boolean) => {
  if (isPromptMode) {
    return false
  }
  const url = new URL(href)
  return url.pathname.includes('/tests/') && !url.searchParams.has('replayId')
}

export const preloadTestWorker = (href: string, isPromptMode: boolean) => {
  if (!shouldPreloadTestWorker(href, isPromptMode)) {
    return
  }
  const promise = getOrCreateLaunchPromise()
  void promise.catch(() => {})
}

export const launchTestWorker = async () => {
  const promise = getOrCreateLaunchPromise()
  try {
    return await promise
  } catch (error) {
    if (launchPromise === promise) {
      launchPromise = undefined
    }
    throw error
  }
}

export const reset = () => {
  launchPromise = undefined
}
