import { existsSync } from 'node:fs'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Product from '../Product/Product.js'

// TODO get rid of no-sandbox somehow https://github.com/electron/electron/issues/17972

const bundleElectronMaybe = async () => {
  if (existsSync(Path.absolute(`build/.tmp/bundle/electron-result`))) {
    console.info('[electron build skipped]')
    return
  }
  const { build } = await import('../BundleElectronApp/BundleElectronApp.js')
  await build()
}

const copyElectronResult = async (arch) => {
  await bundleElectronMaybe()
  // TODO could skip copy by changing which files to dump in snapcraft.yml
  await Copy.copy({
    from: 'build/.tmp/bundle/electron-result',
    to: `build/.tmp/linux/snap/${arch}/files/usr/lib/${Product.applicationName}`,
  })
}

export const build = async () => {
  const arch = 'x64'

  console.time('copyElectronResult')
  await copyElectronResult(arch)
  console.timeEnd('copyElectronResult')
}
