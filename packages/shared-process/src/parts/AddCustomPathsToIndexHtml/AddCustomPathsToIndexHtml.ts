import * as ApplyCustomWorkerPathCliOverride from '../ApplyCustomWorkerPathCliOverride/ApplyCustomWorkerPathCliOverride.ts'
import * as GetCustomPathsConfig from '../GetCustomPathsConfig/GetCustomPathsConfig.ts'
import * as LinkedWorkerPreferences from '../LinkedWorkerPreferences/LinkedWorkerPreferences.ts'
import * as Platform from '../Platform/Platform.ts'
import * as Preferences from '../Preferences/Preferences.ts'

const configElementPattern = /(<script\b[^>]*\bid=["']Config["'][^>]*>)([\s\S]*?)(<\/script>)/i
const whitespaceOnlyPattern = /^\s*$/

const getHtmlIndentation = (content: string, index: number): string => {
  const lineStart = content.lastIndexOf('\n', index - 1) + 1
  const indentation = content.slice(lineStart, index)
  return whitespaceOnlyPattern.test(indentation) ? indentation : ''
}

const serializeConfig = (config: object, indentation: string): string => {
  const json = JSON.stringify(config, null, 2).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026')
  const contentIndentation = `${indentation}  `
  return `${contentIndentation}${json.replaceAll('\n', `\n${contentIndentation}`)}`
}

export const addCustomPathsToIndexHtml = async (content: any, runtimeConfig: { platform?: string } = {}): Promise<any> => {
  let preferences = {}
  if (!Platform.isProduction) {
    preferences = ApplyCustomWorkerPathCliOverride.applyCustomWorkerPathCliOverride(await Preferences.getUserPreferences())
  }
  const linkedWorkerPreferences = await LinkedWorkerPreferences.getLinkedWorkerPreferences()
  const config = { ...GetCustomPathsConfig.getCustomPathsConfig({ ...preferences, ...linkedWorkerPreferences }), ...runtimeConfig }
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
    newContent = newContent.toString().replace(configElementPattern, (_match: any, openingTag: string, _config: string, closingTag: string, index: number) => {
      const indentation = getHtmlIndentation(newContent.toString(), index)
      return `${openingTag}\n${serializeConfig(mergedConfig, indentation)}\n${indentation}${closingTag}`
    })
  } else {
    newContent = newContent.toString().replace(
      '</title>',
      `</title>
    <script type="application/json" id="Config">
${serializeConfig(config, '    ')}
    </script>`,
    )
  }
  return newContent
}
