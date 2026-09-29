import * as ApplyCustomWorkerPathCliOverride from '../ApplyCustomWorkerPathCliOverride/ApplyCustomWorkerPathCliOverride.ts'
import * as GetRemoteUrl from '../GetRemoteUrl/GetRemoteUrl.ts'

const isWorkerPath = ([key, value]: [string, unknown]): boolean => {
  return typeof value === 'string' && ApplyCustomWorkerPathCliOverride.isCustomWorkerPathSetting(key)
}

export const getCustomPathsConfig = (preferences: any): any => {
  const config = Object.create(null)
  if (preferences['develop.rendererProcessPath']) {
    config.rendererProcessPath = GetRemoteUrl.getRemoteUrl(preferences['develop.rendererProcessPath'])
  }
  if (preferences['develop.editorWorkerPath']) {
    config.editorWorkerUrl = GetRemoteUrl.getRemoteUrl(preferences['develop.editorWorkerPath'])
  }
  const workerUrls = Object.fromEntries(
    Object.entries(preferences)
      .filter(isWorkerPath)
      .map(([key, value]) => [key, GetRemoteUrl.getRemoteUrl(value as string)]),
  )
  if (Object.keys(workerUrls).length > 0) {
    config.workerUrls = workerUrls
  }
  return config
}
