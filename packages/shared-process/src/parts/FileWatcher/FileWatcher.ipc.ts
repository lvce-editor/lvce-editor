import * as FileWatcher from '../FileWatcher/FileWatcher.ts'

export const name = 'FileWatcher'

export const Commands = {
  dispose: FileWatcher.dispose,
  handleChange: FileWatcher.handleChange,
  watch: FileWatcher.watch,
  watchFile2: FileWatcher.watchFile2,
}
