export const getSharedProcessId = (): any => {
  return process.pid
}

export const getMainProcessId = (): any => {
  return process.ppid
}
