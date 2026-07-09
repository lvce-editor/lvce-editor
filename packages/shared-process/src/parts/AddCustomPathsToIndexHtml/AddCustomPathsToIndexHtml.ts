import * as GetCustomPathsConfig from '../GetCustomPathsConfig/GetCustomPathsConfig.ts'
import * as Platform from '../Platform/Platform.ts'
import * as Preferences from '../Preferences/Preferences.ts'

export const addCustomPathsToIndexHtml = async (content: any): Promise<any> => {
  if (Platform.isProduction) {
    return content
  }
  const preferences = await Preferences.getUserPreferences()
  const config = GetCustomPathsConfig.getCustomPathsConfig(preferences)
  let newContent = content
  if (config.rendererProcessPath) {
    newContent = newContent
      .toString()
      .replace('/packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js', config.rendererProcessPath)
  }
  const stringifiedConfig = JSON.stringify(config, null, 2)
  newContent = newContent.toString().replace(
    '</title>',
    `</title>
    <script type="application/json" id="Config">${stringifiedConfig}</script>`,
  )
  return newContent
}
