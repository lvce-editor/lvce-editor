import { VError } from '@lvce-editor/verror'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Rename from '../Rename/Rename.js'
import * as Root from '../Root/Root.js'
import * as Template from '../Template/Template.js'

export const copyElectron = async ({ arch, electronVersion, useInstalledElectronVersion, product, platform, version }) => {
  try {
    const outDir = useInstalledElectronVersion
      ? Path.join(Root.root, 'packages', 'main-process', 'node_modules', 'electron', 'dist')
      : Path.join(Root.root, 'build', '.tmp', 'cachedElectronVersions', `electron-${electronVersion}-${platform}-${arch}`)
    await Remove.remove(`build/.tmp/electron-bundle/${arch}`)
    await Copy.copy({
      from: outDir,
      to: `build/.tmp/electron-bundle/${arch}`,
      ignore: ['chrome_crashpad_handler', 'resources'],
      dereference: false,
    })

    if (platform === 'win32') {
      await Rename.rename({
        from: `build/.tmp/electron-bundle/${arch}/electron.exe`,
        to: `build/.tmp/electron-bundle/${arch}/${product.windowsExecutableName}.exe`,
      })
    } else if (platform === 'darwin') {
      await Rename.rename({
        from: `build/.tmp/electron-bundle/${arch}/Electron.app`,
        to: `build/.tmp/electron-bundle/${arch}/${product.applicationName}.app`,
      })
      await Remove.remove(`build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contents/Resources/default_app.asar`)
      await Template.write('macos_info_plist', `build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contents/Resources/Info.plist`, {
        '@@NAME@@': product.nameShort,
        '@@APPLICATION_NAME@@': product.applicationName,
        '@@VERSION@@': version,
      })
      await Rename.rename({
        from: `build/.tmp/electron-bundle/${arch}/LICENSE`,
        to: `build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contebts/Resources/LICENSE`,
      })
      await Rename.rename({
        from: `build/.tmp/electron-bundle/${arch}/LICENSES.chromium.html`,
        to: `build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contebts/Resources/LICENSES.chromium.html`,
      })
      await Remove.remove(`build/.tmp/electron-bundle/${arch}/version`)
    } else {
      await Rename.rename({
        from: `build/.tmp/electron-bundle/${arch}/electron`,
        to: `build/.tmp/electron-bundle/${arch}/${product.applicationName}`,
      })
    }
  } catch (error) {
    throw new VError(error, `Failed to copy electron`)
  }
}
