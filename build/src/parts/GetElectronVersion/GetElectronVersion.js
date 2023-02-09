import minimist from 'minimist'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Process from '../Process/Process.js'

export const getElectronVersion = async () => {
  const options = minimist(Process.argv.slice(0))
  if (options.electronVersion) {
    return { electronVersion: `${options.electronVersion}`, isInstalled: false }
  }
  const packageJson = await JsonFile.readJson('packages/main-process/node_modules/electron/package.json')
  return { electronVersion: packageJson.version, isInstalled: true }
}
