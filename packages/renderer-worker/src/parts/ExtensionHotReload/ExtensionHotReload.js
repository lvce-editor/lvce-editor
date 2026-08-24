import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as FileWatcher from '../FileWatcher/FileWatcher.js'

const defaultDependencies = {
  disposeWatcher: FileWatcher.dispose,
  invokeExtensionManagement: ExtensionManagementWorker.invoke,
  watchFiles: FileWatcher.watch,
}

/** @type {{ dependencies: typeof defaultDependencies, watcher: EventTarget | undefined }} */
const state = {
  dependencies: defaultDependencies,
  watcher: undefined,
}

const handleEvent = (event) => {
  const { dependencies } = state
  void dependencies.invokeExtensionManagement('Extensions.handleLinkedExtensionChange', event.detail).catch((error) => {
    console.error(`[extension-hot-reload] ${error}`)
  })
}

export const dispose = async () => {
  const { dependencies, watcher } = state
  if (!watcher) {
    state.dependencies = defaultDependencies
    return
  }
  state.watcher = undefined
  watcher.removeEventListener('watcher-event', handleEvent)
  await dependencies.disposeWatcher(watcher)
  state.dependencies = defaultDependencies
}

export const watch = async (extensions, dependencies = defaultDependencies) => {
  await dispose()
  state.dependencies = dependencies
  const roots = extensions.map((extension) => extension.uri)
  if (roots.length === 0) {
    return
  }
  const { dependencies: currentDependencies } = state
  const watcher = await currentDependencies.watchFiles({
    exclude: ['.git', 'node_modules'],
    roots,
    useGitIgnore: true,
  })
  state.watcher = watcher
  watcher.addEventListener('watcher-event', handleEvent)
}
