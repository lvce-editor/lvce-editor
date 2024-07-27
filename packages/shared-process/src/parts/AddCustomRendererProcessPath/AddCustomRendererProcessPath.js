import { pathToFileURL } from 'node:url'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'

export const addCustomRendererProcessPath = async (content) => {
  if (Platform.isProduction) {
    return content
  }
  const preferences = await Preferences.getUserPreferences()
  if (preferences['develop.rendererProcessPath']) {
    return content
      .toString()
      .replace(
        '/packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js',
        '/remote' + pathToFileURL(preferences['develop.rendererProcessPath']).toString().slice(7),
      )
  }
  return content
}
