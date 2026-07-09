import * as Process from '../Process/Process.ts'
import * as Signal from '../Signal/Signal.ts'

export const attachDebugger = (pid: any): any => {
  Process.kill(pid, Signal.SIGUSR1)
}
