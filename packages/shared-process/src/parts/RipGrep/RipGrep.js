import * as NodeChildProcess from 'node:child_process'
import * as Assert from '../Assert/Assert.js'
import * as Exec from '../Exec/Exec.js'
import * as RgPath from '../RipGrepPath/RipGrepPath.js'

export const ripGrepPath = process.env.RIP_GREP_PATH || RgPath.rgPath

export const spawn = (args, options) => {
  const childProcess = NodeChildProcess.spawn(RgPath.rgPath, args, options)
  return {
    on(event, listener) {
      childProcess.on(event, listener)
    },
    once(event, listener) {
      childProcess.once(event, listener)
    },
    stdout: childProcess.stdout,
    stderr: childProcess.stderr,
    kill() {
      childProcess.kill()
    },
  }
}

export const exec = async (args, options) => {
  Assert.array(args)
  Assert.object(options)
  const { stdout, stderr } = await Exec.exec(ripGrepPath, args, options)
  return { stdout, stderr }
}
