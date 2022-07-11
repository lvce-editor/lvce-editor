import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'

export const STATUS_OFF = 0
export const STATUS_LOADING = 1
export const STATUS_RUNNING = 2
export const STATUS_ERROR = 3

export const state = {
  status: STATUS_OFF, // TODO should be an enum state
  /**
   * @type {any[]}
   */
  readyCallbacks: [],
  seenEvents: [],
  extensionPromiseCache: Object.create(null),
  /**
   * @type {Promise<void>|undefined}
   */
  extensionHostPromise: undefined,

  /**
   * @type {any}
   */
  extensionHostWorker: undefined,
  /**
   * @type {any[]}
   */
  webExtensions: [],
}

export const startNodeExtensionHost = async () => {
  switch (state.status) {
    case STATUS_LOADING:
    case STATUS_RUNNING:
      throw new Error('extension host is already starting')
  }
  state.status = STATUS_LOADING
  await SharedProcess.invoke(/* ExtensionHost.start */ 'ExtensionHost.start')
  state.status = STATUS_RUNNING
  for (const readyCallback of state.readyCallbacks) {
    readyCallback()
  }
  state.readyCallbacks = []
  // TODO handle error
  await SharedProcess.invoke(
    /* ExtensionHost.setWorkspaceRoot */ 'ExtensionHost.setWorkspaceRoot',
    /* root */ Workspace.getWorkspacePath()
  )
}

export const startWebExtensionHost = async () => {
  const worker = new Worker(
    '/packages/extension-host-worker/src/extensionHostWorkerMain.js',
    {
      type: 'module',
      name: 'Extension Host',
    }
  )
  state.extensionHostWorker = worker
}

const getWebExtensionManifest = async (path) => {
  const manifestPath = `${path}/extension.json`
  const manifest = await Command.execute(
    /* Ajax.getJson */ 'Ajax.getJson',
    /* url */ manifestPath
  )
  return {
    ...manifest,
    path,
  }
}

export const loadWebExtension = async (path) => {
  Assert.object(state.extensionHostWorker)
  const manifest = await getWebExtensionManifest(path)
  state.webExtensions.push(manifest)
  console.log({ manifest })
  // TODO use invoke
  // await new Promise((resolve) => {
  //   setTimeout(resolve, 120)
  // })
  // state.extensionHostWorker.postMessage({
  //   jsonrpc: '2.0',
  //   method: 'Extension.activate',
  //   params: [name],
  // })
}

export const invoke = async (ipc, method, ...params) => {
  // for (const extensionHost of state.extensionHosts) {
  // }
  // console.log({ args })
  // return SharedProcess.invoke(...args)
  // TODO use JSON rpc here or ipc.invoke
  throw new Error('not implemented')
}
