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
  process.kill(pid, signal)
}

export const getPid = () => {
  return process.pid
}

export const { platform } = process
