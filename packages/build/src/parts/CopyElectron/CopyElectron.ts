import { VError } from '@lvce-editor/verror'
import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Rename from '../Rename/Rename.ts'
import * as Root from '../Root/Root.ts'
import * as Template from '../Template/Template.ts'
import { existsSync } from 'node:fs'

export const copyElectron = async ({ arch, electronVersion, useInstalledElectronVersion, product, platform, version }) => {
  const sourceMode = useInstalledElectronVersion ? 'installed' : 'downloaded'
  const outDir = useInstalledElectronVersion
    ? Path.join(Root.root, 'packages', 'main-process', 'node_modules', 'electron', 'dist')
    : Path.join(Root.root, 'build', '.tmp', 'cachedElectronVersions', `electron-${electronVersion}-${platform}-${arch}`)
  try {
    if (!existsSync(outDir)) {
      throw new Error(`electron source path does not exist (${sourceMode}): ${outDir}`)
    }
    await Remove.remove(`packages/build/.tmp/electron-bundle/${arch}`)
    await Copy.copy({
      from: outDir,
      to: `packages/build/.tmp/electron-bundle/${arch}`,
      ignore: ['chrome_crashpad_handler', 'resources'],
      dereference: false,
    })

    if (platform === 'win32') {
      await Rename.rename({
        from: `packages/build/.tmp/electron-bundle/${arch}/electron.exe`,
        to: `packages/build/.tmp/electron-bundle/${arch}/${product.windowsExecutableName}.exe`,
      })
    } else if (platform === 'darwin') {
      await Rename.rename({
        from: `packages/build/.tmp/electron-bundle/${arch}/Electron.app`,
        to: `packages/build/.tmp/electron-bundle/${arch}/${product.applicationName}.app`,
      })
      await Remove.remove(`packages/build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contents/Resources/default_app.asar`)
      await Template.write('macos_info_plist', `packages/build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contents/Info.plist`, {
        '@@NAME@@': product.nameShort,
        '@@APPLICATION_NAME@@': product.applicationName,
        '@@VERSION@@': version,
      })
      await Rename.rename({
        from: `packages/build/.tmp/electron-bundle/${arch}/LICENSE`,
        to: `packages/build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contents/Resources/LICENSE`,
      })
      await Remove.remove(`packages/build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contents/Resources/electron.icns`)
      await Copy.copy({
        from: 'packages/build/files/icon.icns',
        to: `packages/build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contents/Resources/${product.nameShort}.icns`,
      })
      await Rename.rename({
        from: `packages/build/.tmp/electron-bundle/${arch}/LICENSES.chromium.html`,
        to: `packages/build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contents/Resources/LICENSES.chromium.html`,
      })
      await Remove.remove(`packages/build/.tmp/electron-bundle/${arch}/version`)
    } else {
      await Rename.rename({
        from: `packages/build/.tmp/electron-bundle/${arch}/electron`,
        to: `packages/build/.tmp/electron-bundle/${arch}/${product.applicationName}`,
      })
    }
  } catch (error) {
    throw new VError(error, `Failed to copy electron (sourceMode=${sourceMode}, sourcePath=${outDir})`)
  }
}
