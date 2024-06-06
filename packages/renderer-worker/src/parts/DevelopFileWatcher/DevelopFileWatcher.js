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
  const root = await SharedProcess.invoke('Platform.getRoot')
  const watchPaths = getWatchPaths(root)
  const watcher = await FileWatcher.watch({
    roots: watchPaths,
    exclude: ['node_modules', 'dist', '.tmp'],
  })
  const handleEvent = async (event) => {
    const { detail } = event
    if (detail && detail.eventType === 'change' && detail.filename.endsWith('.css')) {
      const cssLoadFile = `/${detail.filename}`
      await Css.reload(cssLoadFile)
    } else if (detail && detail.eventType === 'change' && detail.filename.endsWith('.js')) {
      await Reload.reload()
    }
  }
  // TODO use async iterator
  watcher.addEventListener('watcher-event', handleEvent)
}
