import { readFile } from 'node:fs/promises'
import * as AddCustomPathsToIndexHtml from '../AddCustomPathsToIndexHtml/AddCustomPathsToIndexHtml.ts'
import * as IsDocumentNavigation from '../IsDocumentNavigation/IsDocumentNavigation.ts'
import * as Platform from '../Platform/Platform.ts'
import * as ShouldTranspileTypescript from '../ShouldTranspileTypescript/ShouldTranspileTypescript.ts'
import * as TranspileTypeScript from '../TranspileTypeScript/TranspileTypeScript.ts'
import * as WebSocketIssuerRegistry from '../WebSocketIssuerRegistry/WebSocketIssuerRegistry.ts'

const useCache = false // TODO enable this

export const getElectronFileResponseContent = async (request: any, absolutePath: any, url: any): Promise<any> => {
  if (ShouldTranspileTypescript.shouldTranspileTypescript(request, url)) {
    const content = await readFile(absolutePath)
    const newContent = await TranspileTypeScript.transpileTypeScript(content.toString(), useCache)
    if (typeof newContent === 'string') {
      return Buffer.from(newContent)
    }
    const newContentString = newContent.outputText
    const newContentBuffer = Buffer.from(newContentString)
    return newContentBuffer
  }
  let content = await readFile(absolutePath)
  if (!Platform.isProduction && url === `${Platform.scheme}://-/`) {
    // @ts-ignore
    content = content.toString().replace('    <link rel="manifest" href="/manifest.json" crossorigin="use-credentials" />\n', '')
    content = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(content)
  }
  if (url === '/' || url.startsWith('/?')) {
    const additionalConfig = IsDocumentNavigation.isDocumentNavigation(request) ? { webSocketIssuer: WebSocketIssuerRegistry.create() } : {}
    content = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(content, additionalConfig)
  }
  if (typeof content === 'string') {
    content = Buffer.from(content)
  }
  return content
}
