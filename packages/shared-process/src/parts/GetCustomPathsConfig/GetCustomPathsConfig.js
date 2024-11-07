import * as GetRemoteUrl from '../GetRemoteUrl/GetRemoteUrl.js'

export const getCustomPathsConfig = (preferences) => {
  const config = Object.create(null)
  if (preferences['develop.rendererProcessPath']) {
    config.rendererProcessPath = GetRemoteUrl.getRemoteUrl(preferences['develop.rendererProcessPath'])
  }
  if (preferences['develop.extensionHostWorkerPath']) {
    config.extensionHostWorkerUrl = GetRemoteUrl.getRemoteUrl(preferences['develop.extensionHostWorkerPath'])
  }
  if (preferences['develop.editorWorkerPath']) {
    config.editorWorkerUrl = GetRemoteUrl.getRemoteUrl(preferences['develop.editorWorkerPath'])
  }
  return config
}
