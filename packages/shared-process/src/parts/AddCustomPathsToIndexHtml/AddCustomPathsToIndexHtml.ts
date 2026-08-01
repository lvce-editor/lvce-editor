import * as ApplyCustomWorkerPathCliOverride from '../ApplyCustomWorkerPathCliOverride/ApplyCustomWorkerPathCliOverride.ts'
import * as GetCustomPathsConfig from '../GetCustomPathsConfig/GetCustomPathsConfig.ts'
import * as Platform from '../Platform/Platform.ts'
import * as Preferences from '../Preferences/Preferences.ts'

export const addCustomPathsToIndexHtml = async (content: any, additionalConfig: Readonly<Record<string, unknown>> = {}): Promise<any> => {
  const config = Platform.isProduction
    ? {}
    : GetCustomPathsConfig.getCustomPathsConfig(
        ApplyCustomWorkerPathCliOverride.applyCustomWorkerPathCliOverride(await Preferences.getUserPreferences()),
      )
  let newContent = content
  if ('rendererProcessPath' in config && config.rendererProcessPath) {
    newContent = newContent
      .toString()
      .replace('/packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js', config.rendererProcessPath)
  }
  const stringifiedConfig = JSON.stringify({ ...config, ...additionalConfig }, null, 2)
  newContent = newContent.toString().replace(
    '</title>',
    `</title>
    <script type="application/json" id="Config">${stringifiedConfig}</script>`,
  )
  return newContent
}
