import { fork } from 'node:child_process'
import * as PtyHostPath from '../PtyHostPath/PtyHostPath.js'

export const create = async () => {
  const ptyHostPath = await PtyHostPath.getPtyHostPath()
  const ptyHost = fork(ptyHostPath, { stdio: 'inherit' })
  return ptyHost
}
