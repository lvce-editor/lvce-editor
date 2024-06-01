import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const watch = (options) => {
  return SharedProcess.invoke('FileWatcher.watch', options)
}
