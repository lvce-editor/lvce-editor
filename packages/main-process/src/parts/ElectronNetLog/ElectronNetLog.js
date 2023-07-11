import { netLog } from 'electron'

export const startLogging = async (path) => {
  await netLog.startLogging(path)
}

export const stopLogging = async () => {
  await netLog.stopLogging()
}
