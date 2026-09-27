import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

const getLogUri = async () => {
  const logsDir = await PlatformPaths.getLogsDir()
  return `${logsDir}/log-preview-sandbox.txt`
}

export const logWarning = async (message) => {
  const logUri = await getLogUri()
  await FileSystemWorker.appendFile(logUri, `${message}\n`)
}

export const clearOutput = async () => {
  const logUri = await getLogUri()
  await FileSystemWorker.writeFile(logUri, '')
}
