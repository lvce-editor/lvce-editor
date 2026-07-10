import * as FileWatcher from '../FileWatcher/FileWatcher.ts'

export const name = 'FileWatcher'

export const Commands = {
  handleChange: FileWatcher.handleChange,
  watch: FileWatcher.watch,
  watchFile2: FileWatcher.watchFile2,
}
