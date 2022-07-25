import { fork } from 'node:child_process'

export const create = (url, options) => {
  const childProcess = fork(url, options)
  return {
    on(event, listener) {},
    dispose() {
      childProcess.kill()
    },
  }
}
