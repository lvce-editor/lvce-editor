import * as FileWatcher from './FileWatcher.js'

export const name = 'FileWatcher'

export const Commands = {
  handleEvent: FileWatcher.handleEvent,
  watchFile: FileWatcher.watchFile,
}
