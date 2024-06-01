import * as FileWatcher from '../FileWatcher/FileWatcher.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Reload from '../Reload/Reload.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const hydrate = async () => {
  if (IsProduction.isProduction) {
    return
  }
  const enabled = Preferences.get('develop.fileWatcher')
  if (!enabled) {
    return
  }
  const root = await SharedProcess.invoke('Platform.getRoot')
  const staticPath = `${root}/static`
  const watcher = await FileWatcher.watch({
    root: staticPath,
    exclude: ['node_modules', 'dist', '.tmp'],
  })
  const handleEvent = async (event) => {
    const { detail } = event
    if (detail && detail.eventType === 'change') {
      await Reload.reload()
    }
    // console.log(detail)
  }
  // TODO use async iterator
  watcher.addEventListener('watcher-event', handleEvent)
  // const watcher =
}
