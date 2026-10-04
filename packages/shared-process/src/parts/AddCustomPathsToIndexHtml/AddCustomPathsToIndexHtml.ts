import * as ApplyCustomWorkerPathCliOverride from '../ApplyCustomWorkerPathCliOverride/ApplyCustomWorkerPathCliOverride.ts'
import * as GetCustomPathsConfig from '../GetCustomPathsConfig/GetCustomPathsConfig.ts'
import * as LinkedWorkerPreferences from '../LinkedWorkerPreferences/LinkedWorkerPreferences.ts'
import * as Platform from '../Platform/Platform.ts'
import * as Preferences from '../Preferences/Preferences.ts'

const configElementPattern = /(<script\b[^>]*\bid=["']Config["'][^>]*>)([\s\S]*?)(<\/script>)/i

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
  const configElement = newContent.toString().match(configElementPattern)
  if (configElement) {
    const existingConfig = JSON.parse(configElement[2])
    const mergedConfig = {
      ...existingConfig,
      ...config,
      ...(existingConfig.workerUrls || config.workerUrls
        ? {
            workerUrls: {
              ...existingConfig.workerUrls,
              ...config.workerUrls,
            },
          }
        : {}),
    }
    newContent = newContent.toString().replace(configElementPattern, (_match: any, openingTag: string, _config: string, closingTag: string) => {
      return `${openingTag}${JSON.stringify(mergedConfig)}${closingTag}`
    })
  } else {
    const stringifiedConfig = JSON.stringify(config, null, 2)
    newContent = newContent.toString().replace(
      '</title>',
      `</title>
    <script type="application/json" id="Config">${stringifiedConfig}</script>`,
    )
  }
  return newContent
}
