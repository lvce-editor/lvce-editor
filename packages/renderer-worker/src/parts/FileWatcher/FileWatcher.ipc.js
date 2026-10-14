import * as FileWatcher from './FileWatcher.js'

export const name = 'FileWatcher'

export const Commands = {
  disposeExtension: FileWatcher.disposeExtension,
  watchExtension: FileWatcher.watchExtension,
  handleEvent: FileWatcher.handleEvent,
  watchFile: FileWatcher.watchFile,
}
