import { VError } from '../VError/VError.ts'
import * as IsEsrchError from '../IsEsrchError/IsEsrchError.ts'

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

export const argv = new Proxy([], {
  get(_target, property) {
    const value = Reflect.get(process.argv, property)
    if (typeof value === 'function') {
      return value.bind(process.argv)
    }
    return value
  },
  set(_target, property, value) {
    return Reflect.set(process.argv, property, value)
  },
})

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
