import { pathToFileURL } from 'node:url'

const getRemoteUrl = (path) => {
  return '/remote' + pathToFileURL(path).toString().slice(7)
}

export const getCustomPathsConfig = (preferences) => {
  const config = Object.create(null)
  if (preferences['develop.rendererProcessPath']) {
    config.rendererProcessPath = getRemoteUrl(preferences['develop.rendererProcessPath'])
  }
  if (preferences['develop.extensionHostWorkerPath']) {
    config.extensionHostWorkerUrl = getRemoteUrl(preferences['develop.extensionHostWorkerPath'])
  }
  if (preferences['develop.editorWorkerPath']) {
    config.editorWorkerUrl = getRemoteUrl(preferences['develop.editorWorkerPath'])
  }
  return config
}
