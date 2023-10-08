export const exit = (code) => {
  process.exit(code)
}

export const setExitCode = (exitCode) => {
  process.exitCode = exitCode
}

export const { argv } = process

export const isConnected = () => {
  return process.connected
}

export const getPid = () => {
  return process.pid
}
