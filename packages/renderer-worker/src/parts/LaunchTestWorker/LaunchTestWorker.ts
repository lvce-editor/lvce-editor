import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as TestWorker from '../TestWorker/TestWorker.js'
import * as TestWorkerUrl from '../TestWorkerUrl/TestWorkerUrl.js'

const createTestWorker = async (): Promise<any> => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.testWorkerPath', TestWorkerUrl.testWorkerUrl)
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Test Worker',
    url: configuredWorkerUrl,
  })
  HandleIpc.handleIpc(ipc)
  TestWorker.set(ipc)
  await JsonRpc.invoke(ipc, 'RendererProcess.initialize')
  return ipc
}

const state: {
  launchPromise: ReturnType<typeof createTestWorker> | undefined
} = {
  launchPromise: undefined,
}

const getOrCreateLaunchPromise = (): ReturnType<typeof createTestWorker> => {
  const { launchPromise } = state
  if (launchPromise) {
    return launchPromise
  }
  const promise = createTestWorker()
  state.launchPromise = promise
  return promise
}

const shouldPreloadTestWorker = (href: string, isPromptMode: boolean): boolean => {
  if (isPromptMode) {
    return false
  }
  const url = new URL(href)
  return url.pathname.includes('/tests/') && !url.searchParams.has('replayId')
}

export const preloadTestWorker = (href: string, isPromptMode: boolean): void => {
  if (!shouldPreloadTestWorker(href, isPromptMode)) {
    return
  }
  const promise = getOrCreateLaunchPromise()
  void promise.catch(() => {})
}

export const launchTestWorker = async (): Promise<any> => {
  const promise = getOrCreateLaunchPromise()
  try {
    return await promise
  } catch (error) {
    const { launchPromise } = state
    if (launchPromise === promise) {
      state.launchPromise = undefined
    }
    throw error
  }
}

export const reset = (): void => {
  state.launchPromise = undefined
}
