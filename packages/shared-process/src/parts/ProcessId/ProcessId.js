export const getSharedProcessId = () => {
  return process.pid
}

export const getMainProcessId = () => {
  return process.ppid
}
