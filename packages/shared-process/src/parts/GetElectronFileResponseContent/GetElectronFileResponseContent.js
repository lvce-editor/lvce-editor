import { readFile } from 'node:fs/promises'
import * as Platform from '../Platform/Platform.js'
import * as ShouldTranspileTypescript from '../ShouldTranspileTypescript/ShouldTranspileTypescript.js'
import * as TranspileTypeScript from '../TranspileTypeScript/TranspileTypeScript.js'

export const getElectronFileResponseContent = async (request, absolutePath, url) => {
  let content = await readFile(absolutePath)
  if (ShouldTranspileTypescript.shouldTranspileTypescript(request, url)) {
    const newContent = await TranspileTypeScript.transpileTypeScript(content.toString())
    content = newContent.outputText
  }
  if (!Platform.isProduction && url === `${Platform.scheme}://-/`) {
    // @ts-ignore
    content = content.toString().replace('    <link rel="manifest" href="/manifest.json" crossorigin="use-credentials" />\n', '')
  }
  return content
}
