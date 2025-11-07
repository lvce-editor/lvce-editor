import * as FileWatcher from '../FileWatcher/FileWatcher.js'

export const name = 'FileWatcher'

export const Commands = {
  watch: FileWatcher.watch,
  watchFile2: FileWatcher.watchFile2,
  handleChange: FileWatcher.handleChange,
}
