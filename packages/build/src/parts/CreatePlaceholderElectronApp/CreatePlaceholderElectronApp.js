import * as ElectronBuilder from 'electron-builder'
import { VError } from '@lvce-editor/verror'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Template from '../Template/Template.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const copyElectronBuilderConfig = async ({ config, version, product, electronVersion }) => {
  await Template.write(config, 'packages/build/.tmp/electron-builder-placeholder-app/package.json', {
    '@@NAME@@': product.applicationName,
    '@@AUTHOR@@': product.linuxMaintainer,
    '@@VERSION@@': version,
    '@@HOMEPAGE@@': product.homePage,
    '@@ELECTRON_VERSION@@': electronVersion,
    '@@NAME_LONG@@': product.nameLong,
    '@@LICENSE@@': product.licenseName,
    '@@PRODUCT_NAME@@': product.nameLong,
    '@@WINDOWS_EXECUTABLE_NAME@@': product.windowsExecutableName,
    '@@MAIN@@': 'packages/main-process/dist/mainProcessMain.js',
  })
}

const runElectronBuilder = async ({}) => {
  try {
    /**
     * @type {ElectronBuilder.CliOptions}
     */
    const options = {
      projectDir: Path.absolute('packages/build/.tmp/electron-builder-placeholder-app'),
    }
    await ElectronBuilder.build(options)
  } catch (error) {
    throw new VError(error, `Electron builder failed to execute`)
  }
}

// workaround for modifying exe properties, which
// doesn't seem to be possible with electron builder
// for prepackaged apps
export const createPlaceholderElectronApp = async ({ config, product, version, electronVersion }) => {
  await copyElectronBuilderConfig({ config, product, version, electronVersion })

  await WriteFile.writeFile({
    to: 'packages/build/.tmp/electron-builder-placeholder-app/packages/main-process/dist/mainProcessMain.js',
    content: '',
  })

  await Copy.copy({
    from: `build/files/icon.ico`,
    to: 'packages/build/.tmp/electron-builder-placeholder-app/build/icon.ico',
  })

  await runElectronBuilder({})
}
