import { VError } from '../VError/VError.js'
import * as IsEsrchError from '../IsEsrchError/IsEsrchError.js'

export const crash = (message) => {
  throw new Error(message)
}

export const crashAsync = async (message) => {
  throw new Error(message)
}

export const exit = (code) => {
  process.exit(code)
}

export const setExitCode = (exitCode) => {
  process.exitCode = exitCode
}

export const { argv } = process

export const cwd = () => {
  return process.cwd()
}

export const memoryUsage = () => {
  return process.memoryUsage()
}

export const isConnected = () => {
  return process.connected
}

export const kill = (pid, signal) => {
  try {
    process.kill(pid, signal)
  } catch (error) {
    if (IsEsrchError.isEsrchError(error)) {
      return
    }
    throw new VError(error, `Failed to kill process ${pid} with signal ${signal}`)
  }
}

export const getPid = () => {
  return process.pid
}

export const { platform } = process

export const getV8Version = () => {
  return process.versions.v8
}

export const getNodeVersion = () => {
  return process.versions.node
}

export const getArch = () => {
  return process.arch
}
