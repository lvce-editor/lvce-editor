import * as IsEsrchError from '../IsEsrchError/IsEsrchError.ts'
import { VError } from '../VError/VError.ts'

export const crash = (message: any): any => {
  throw new Error(message)
}

export const crashAsync = async (message: any): Promise<any> => {
  throw new Error(message)
}

export const exit = (code: any): any => {
  process.exit(code)
}

export const setExitCode = (exitCode: any): any => {
  process.exitCode = exitCode
}

export const argv = new Proxy([], {
  get(_target: any, property: any): any {
    const value = Reflect.get(process.argv, property)
    if (typeof value === 'function') {
      return value.bind(process.argv)
    }
    return value
  },
  set(_target: any, property: any, value: any): any {
    return Reflect.set(process.argv, property, value)
  },
})

export const cwd = (): any => {
  return process.cwd()
}

export const memoryUsage = (): any => {
  return process.memoryUsage()
}

export const isConnected = (): any => {
  return process.connected
}

export const kill = (pid: any, signal: any): any => {
  try {
    process.kill(pid, signal)
  } catch (error) {
    if (IsEsrchError.isEsrchError(error)) {
      return
    }
    throw new VError(error, `Failed to kill process ${pid} with signal ${signal}`)
  }
}

export const getPid = (): any => {
  return process.pid
}

export const { platform } = process

export const getV8Version = (): any => {
  return process.versions.v8
}

export const getNodeVersion = (): any => {
  return process.versions.node
}

export const getArch = (): any => {
  return process.arch
}
