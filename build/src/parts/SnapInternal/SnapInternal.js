import { existsSync } from 'node:fs'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Logger from '../Logger/Logger.js'
import * as ArchType from '../ArchType/ArchType.js'
// TODO get rid of no-sandbox somehow https://github.com/electron/electron/issues/17972

const bundleElectronMaybe = async ({ product }) => {
  if (existsSync(Path.absolute(`build/.tmp/bundle/electron-result`))) {
    Logger.info('[electron build skipped]')
    return
  }
  const { build } = await import('../BundleElectronApp/BundleElectronApp.js')
  await build({ product })
}

const copyElectronResult = async ({ arch, product }) => {
  await bundleElectronMaybe({ product })
  // TODO could skip copy by changing which files to dump in snapcraft.yml
  await Copy.copy({
    from: 'build/.tmp/bundle/electron-result',
    to: `build/.tmp/linux/snap/${arch}/files/usr/lib/${product.applicationName}`,
  })
}

export const build = async ({ product }) => {
  const arch = ArchType.X64

  console.time('copyElectronResult')
  await copyElectronResult({ arch, product })
  console.timeEnd('copyElectronResult')
}
