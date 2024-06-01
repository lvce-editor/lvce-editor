import * as Preferences from '../Preferences/Preferences.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as FileWatcher from '../FileWatcher/FileWatcher.js'

export const hydrate = async () => {
  if (IsProduction.isProduction) {
    return
  }
  const enabled = Preferences.get('develop.fileWatcher')
  if (!enabled) {
    return
  }
  const root = await SharedProcess.invoke('Platform.getRoot')
  await FileWatcher.watch({
    root,
    exclude: ['node_modules', 'dist', '.tmp'],
  })
  console.log({ root })
  // const watcher =
}
