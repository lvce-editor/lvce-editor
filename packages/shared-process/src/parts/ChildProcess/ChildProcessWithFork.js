import { fork } from 'node:child_process'

export const create = (path) => {
  const childProcess = fork(path)
  let _listener
  return {
    get onmessage() {
      return _listener
    },
    set onmessage(listener) {
      if (listener) {
        childProcess.on('message', listener)
      } else {
        childProcess.off('message', listener)
      }
      _listener = listener
    },
  }
}
