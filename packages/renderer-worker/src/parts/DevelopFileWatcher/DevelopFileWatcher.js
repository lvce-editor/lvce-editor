import * as Css from '../Css/Css.js'
import * as FileWatcher from '../FileWatcher/FileWatcher.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Reload from '../Reload/Reload.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const getWatchPaths = (root) => {
  return [`${root}/static`, `${root}/packages/renderer-worker/src`]
}

export const hydrate = async () => {
  if (IsProduction.isProduction) {
    return
  }
  const enabled = Preferences.get('develop.fileWatcher')
  if (!enabled) {
    return
  }
  const rootUri = await SharedProcess.invoke('Platform.getRootUri')
  const watchPaths = getWatchPaths(rootUri)
  const watcher = await FileWatcher.watch({
    roots: watchPaths,
    exclude: ['node_modules', 'dist', '.tmp'],
  })
  const handleEvent = async (event) => {
    const { detail } = event
    const { eventName, uri } = detail
    if (eventName === 'change' && uri.endsWith('.css')) {
      const cssLoadFile = uri.slice(rootUri.length)
      await Css.reload(cssLoadFile)
    } else if (eventName === 'change' && uri.endsWith('.js')) {
      await Reload.reload()
    }
  }
  // TODO use async iterator
  watcher.addEventListener('watcher-event', handleEvent)
}
