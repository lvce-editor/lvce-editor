import * as ApplyCustomWorkerPathCliOverride from '../ApplyCustomWorkerPathCliOverride/ApplyCustomWorkerPathCliOverride.ts'
import * as GetCustomPathsConfig from '../GetCustomPathsConfig/GetCustomPathsConfig.ts'
import * as LinkedWorkerPreferences from '../LinkedWorkerPreferences/LinkedWorkerPreferences.ts'
import * as Platform from '../Platform/Platform.ts'
import * as Preferences from '../Preferences/Preferences.ts'

export const addCustomPathsToIndexHtml = async (content: any): Promise<any> => {
  let preferences = {}
  if (!Platform.isProduction) {
    preferences = ApplyCustomWorkerPathCliOverride.applyCustomWorkerPathCliOverride(await Preferences.getUserPreferences())
  }
  const linkedWorkerPreferences = await LinkedWorkerPreferences.getLinkedWorkerPreferences()
  const config = GetCustomPathsConfig.getCustomPathsConfig({ ...preferences, ...linkedWorkerPreferences })
  if (Object.keys(config).length === 0) {
    return content
  }
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
