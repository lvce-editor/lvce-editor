import * as WorkerViewletAdapterMain from '../WorkerViewletAdapterMain/WorkerViewletAdapterMain.js'
import * as WorkerViewletAdapters from '../WorkerViewletAdapters/WorkerViewletAdapters.js'

const clearItemsOnHotReload = {
  prepareHotReloadState(state) {
    return { ...state, items: [] }
  },
}

const adapters = {
  activityBar: WorkerViewletAdapters.activityBar,
  chatDebug: WorkerViewletAdapters.chatDebug,
  chatView: {
    extendModule() {
      return {
        focus(state) {
          return {
            ...state,
            commands: [['Viewlet.focusSelector', '[name="composer"]']],
          }
        },
      }
    },
  },
  diffView: WorkerViewletAdapters.diffView,
  explorer: WorkerViewletAdapters.explorer,
  extensionSearch: WorkerViewletAdapters.extensions,
  extensionDetail: {
    extendModule(_workerViewlet, { wrapCommand }) {
      return { wrapExtensionDetailCommand: wrapCommand }
    },
    getHotReloadSavedState() {
      return {}
    },
  },
  iframeInspector: clearItemsOnHotReload,
  keyBindings: clearItemsOnHotReload,
  mainArea: WorkerViewletAdapterMain,
  output: clearItemsOnHotReload,
  preview: WorkerViewletAdapters.preview,
  problemsViewWorker: WorkerViewletAdapters.problems,
  processExplorer: WorkerViewletAdapters.processExplorer,
  quickPickWorker: WorkerViewletAdapters.quickPick,
  settingsView: Object.assign({}, clearItemsOnHotReload, WorkerViewletAdapters.settings),
  textSearchView: WorkerViewletAdapters.textSearch,
  titleBar: WorkerViewletAdapters.titleBar,
}

const emptyAdapter = {
  async afterLoadContent() {},
  extendCommands() {},
  extendModule() {
    return undefined
  },
  getHotReloadSavedState(state, saveState) {
    return saveState ? saveState(state) : {}
  },
  prepareHotReloadState(state) {
    return state
  },
  prepareLoadState(state) {
    return state
  },
  transformLoadedState(state) {
    return state
  },
  transformRenderedState(state) {
    return state
  },
  transformState(state) {
    return state
  },
  wrapCommand(command, defaultWrapCommand) {
    return defaultWrapCommand(command)
  },
}

export const getWorkerViewletAdapter = (workerId) => {
  return Object.assign({}, emptyAdapter, adapters[workerId])
}
