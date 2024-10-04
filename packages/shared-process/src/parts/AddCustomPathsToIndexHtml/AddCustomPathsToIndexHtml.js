import { pathToFileURL } from 'node:url'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'

export const addCustomPathsToIndexHtml = async (content) => {
  if (Platform.isProduction) {
    return content
  }
  let newContent = content
  const preferences = await Preferences.getUserPreferences()
  console.log({ preferences })
  if (preferences['develop.rendererProcessPath']) {
    newContent = newContent
      .toString()
      .replace(
        '/packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js',
        '/remote' + pathToFileURL(preferences['develop.rendererProcessPath']).toString().slice(7),
      )
  }
  if (preferences['develop.extensionHostWorkerPath']) {
    console.log('REPLCE 2')
    const actualUrl = '/remote' + pathToFileURL(preferences['develop.extensionHostWorkerPath']).toString().slice(7)
    const config = JSON.stringify({
      extensionHostWorkerUrl: actualUrl,
    })
    newContent = newContent.toString().replace(
      '</title>',
      `</title>
      <script type="application.json" id="Config">${config}</script>`,
    )
  }
  return newContent
}
