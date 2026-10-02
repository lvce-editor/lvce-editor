import * as ComponentWorkerNames from '../ComponentWorkerNames/ComponentWorkerNames.js'
import * as RuntimeWorkerPaths from '../RuntimeWorkerPaths/RuntimeWorkerPaths.ts'

export const getRuntimeWorkerUrl = (preferenceKey: string, fallback: string): string => {
  const url = RuntimeWorkerPaths.get(preferenceKey) || fallback
  ComponentWorkerNames.registerUrl(preferenceKey, url)
  return url
}
