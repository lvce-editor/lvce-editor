import * as Process from '../Process/Process.js'
import * as Signal from '../Signal/Signal.js'

export const attachDebugger = (pid) => {
  Process.kill(pid, Signal.SIGUSR1)
}
