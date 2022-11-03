import { fork } from 'node:child_process'
import * as PtyHostPath from '../PtyHostPath/PtyHostPath.js'

export const create = async () => {
  const ptyHostPath = await PtyHostPath.getPtyHostPath()
  const ptyHost = fork(ptyHostPath, ['--ipc-type=websocket'], {
    stdio: 'inherit',
  })
  return ptyHost
}
