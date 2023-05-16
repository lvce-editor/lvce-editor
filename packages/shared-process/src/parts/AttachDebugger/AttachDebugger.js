import * as Process from '../Process/Process.js'

export const attachDebugger = (pid) => {
  Process.kill(pid, 'SIGUSR1')
}
