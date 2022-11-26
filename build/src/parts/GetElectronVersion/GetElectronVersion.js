import minimist from 'minimist'
import * as JsonFile from '../JsonFile/JsonFile.js'

export const getElectronVersion = async () => {
  const options = minimist(process.argv.slice(0))
  if (options.electronVersion) {
    return options.electronVersion
  }
  const packageJson = await JsonFile.readJson(
    'packages/main-process/node_modules/electron/package.json'
  )
  return packageJson.version
}
