import { readFile } from 'node:fs/promises'
import * as Platform from '../Platform/Platform.js'
import * as ShouldTranspileTypescript from '../ShouldTranspileTypescript/ShouldTranspileTypescript.js'
import * as TranspileTypeScript from '../TranspileTypeScript/TranspileTypeScript.js'
import * as Preferences from '../Preferences/Preferences.js'
import { pathToFileURL } from 'node:url'

export const getElectronFileResponseContent = async (request, absolutePath, url) => {
  if (ShouldTranspileTypescript.shouldTranspileTypescript(request, url)) {
    const content = await readFile(absolutePath)
    const newContent = await TranspileTypeScript.transpileTypeScript(content.toString())
    const newContentString = newContent.outputText
    const newContentBuffer = Buffer.from(newContentString)
    return newContentBuffer
  }
  let content = await readFile(absolutePath)
  if (!Platform.isProduction && url === `${Platform.scheme}://-/`) {
    // @ts-ignore
    content = content.toString().replace('    <link rel="manifest" href="/manifest.json" crossorigin="use-credentials" />\n', '')
  }
  if (!Platform.isProduction && url === '/') {
    const preferences = await Preferences.getUserPreferences()
    if (preferences['develop.rendererProcessPath']) {
      console.log('custom renderer process path')
      // @ts-ignore
      content = content
        .toString()
        .replace(
          '/packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js',
          '/remote' + pathToFileURL(preferences['develop.rendererProcessPath']).toString().slice(7),
        )
    }
  }
  if (typeof content === 'string') {
    content = Buffer.from(content)
  }
  return content
}
