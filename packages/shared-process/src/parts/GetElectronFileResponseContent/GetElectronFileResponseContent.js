import { readFile } from 'node:fs/promises'
import * as IsTypeScriptPath from '../IsTypeScriptPath/IsTypeScriptPath.js'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as TranspileTypeScript from '../TranspileTypeScript/TranspileTypeScript.js'

let cachedPreferences = undefined

const getPreferences = () => {
  if (!cachedPreferences) {
    cachedPreferences = Preferences.getAll()
  }
  return cachedPreferences
}

export const getElectronFileResponseContent = async (absolutePath, url) => {
  let content = await readFile(absolutePath)
  if (IsTypeScriptPath.isTypeScriptPath(url)) {
    const preferences = await getPreferences()
    if (preferences['typescript.transpile']) {
      const newContent = await TranspileTypeScript.transpileTypeScript(content.toString())
      content = newContent.outputText
    }
  }
  if (!Platform.isProduction && url === `${Platform.scheme}://-/`) {
    // @ts-ignore
    content = content.toString().replace('    <link rel="manifest" href="/manifest.json" crossorigin="use-credentials" />\n', '')
  }
  return content
}
