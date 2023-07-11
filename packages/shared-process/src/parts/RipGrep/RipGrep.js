import * as NodeChildProcess from 'node:child_process'
import * as Assert from '../Assert/Assert.js'
import * as Env from '../Env/Env.js'
import * as Exec from '../Exec/Exec.js'
import * as RgPath from '../RipGrepPath/RipGrepPath.js'
import { VError } from '../VError/VError.js'

export const ripGrepPath = Env.getRipGrepPath() || RgPath.rgPath

export const spawn = (args, options) => {
  try {
    const childProcess = NodeChildProcess.spawn(RgPath.rgPath, args, options)
    return {
      childProcess,
      on(event, listener) {
        this.childProcess.on(event, listener)
      },
      off(event, listener) {
        this.childProcess.off(event, listener)
      },
      once(event, listener) {
        this.childProcess.once(event, listener)
      },
      stdout: childProcess.stdout,
      stderr: childProcess.stderr,
      kill() {
        this.childProcess.kill()
      },
    }
  } catch (error) {
    throw new VError(error, `Failed to spawn ripgrep`)
  }
}

export const exec = async (args, options) => {
  Assert.array(args)
  Assert.object(options)
  const { stdout, stderr } = await Exec.exec(ripGrepPath, args, options)
  return { stdout, stderr }
}
