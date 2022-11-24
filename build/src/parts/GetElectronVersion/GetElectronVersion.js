import minimist from 'minimist'
import * as JsonFile from '../JsonFile/JsonFile.js'

export const getElectronVersion = async () => {
  const options = minimist(process.argv.slice(0))
  if (options.electronVersion) {
    return options.electronVersion
  }
  if (options['use-installed-electron-version']) {
    const packageJson = await JsonFile.readJson(
      'packages/main-process/node_modules/electron/package.json'
    )
    return packageJson.version
  }
  // this is the last version which works for rebuilding
  // node-pty which is required for terminals to work
  return '19.1.6'
}
