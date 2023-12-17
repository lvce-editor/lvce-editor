import * as Assert from '../Assert/Assert.js'

export const setExitCode = (code) => {
  Assert.number(code)
  process.exitCode = code
}

export const exit = (code) => {
  Assert.number(code)
  process.exit(code)
}

export const on = (event, listener) => {
  process.on(event, listener)
}

export const getElectronVersion = () => {
  return process.versions.electron
}

export const getChromeVersion = () => {
  return process.versions.chrome
}

export const getNodeVersion = () => {
  return process.versions.node
}

export const getV8Version = () => {
  return process.versions.v8
}

export const cwd = () => {
  return process.cwd()
}

export const getPid = () => {
  return process.pid
}

export const getArgv = () => {
  return process.argv
}

export const { pid } = process

export const { execPath } = process

export const { argv } = process
