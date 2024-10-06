import { pathToFileURL } from 'node:url'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'

const getRemoteUrl = (path) => {
  return '/remote' + pathToFileURL(path).toString().slice(7)
}

export const addCustomPathsToIndexHtml = async (content) => {
  if (Platform.isProduction) {
    return content
  }
  let newContent = content
  const preferences = await Preferences.getUserPreferences()
  if (preferences['develop.rendererProcessPath']) {
    newContent = newContent
      .toString()
      .replace(
        '/packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js',
        getRemoteUrl(preferences['develop.rendererProcessPath']),
      )
  }
  const config = Object.create(null)
  if (preferences['develop.extensionHostWorkerPath']) {
    config.extensionHostWorkerUrl = getRemoteUrl(preferences['develop.extensionHostWorkerPath'])
  }
  if (preferences['develop.editorWorkerPath']) {
    config.extensionHostWorkerUrl = getRemoteUrl(preferences['develop.editorWorkerPath'])
  }
  const stringifiedConfig = JSON.stringify(config, null, 2)
  newContent = newContent.toString().replace(
    '</title>',
    `</title>
    <script type="application.json" id="Config">${stringifiedConfig}</script>`,
  )
  return newContent
}
