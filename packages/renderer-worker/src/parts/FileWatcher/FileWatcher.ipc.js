import * as FileWatcher from './FileWatcher.js'
import * as GitIgnoreWatcher from '../GitIgnoreWatcher/GitIgnoreWatcher.js'

export const name = 'FileWatcher'

export const Commands = {
  disposeExtension: FileWatcher.disposeExtension,
  watchExtension: FileWatcher.watchExtension,
  handleEvent: FileWatcher.handleEvent,
  watchFile: FileWatcher.watchFile,
  watchGitIgnore: GitIgnoreWatcher.watch,
}
