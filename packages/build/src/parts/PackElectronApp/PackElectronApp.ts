import { createPackageWithOptions } from '@electron/asar'
import { rm } from 'node:fs/promises'
import * as Path from '../Path/Path.ts'
import * as Replace from '../Replace/Replace.ts'

export const packElectronApp = async ({ resourcesPath }) => {
  const appPath = Path.absolute(`${resourcesPath}/app`)
  // The shared process runs in plain Node, which cannot read ASAR archives.
  // Its static server, native modules and extension executables need real paths.
  await Replace.replace({
    path: `${appPath}/packages/main-process/dist/mainProcessMain.js`,
    occurrence: `const root = join(__dirname$1, '../../..')`,
    replacement: `const root = join(__dirname$1, '../../..').replace(/app\\.asar$/, 'app.asar.unpacked')`,
  })
  await createPackageWithOptions(appPath, Path.absolute(`${resourcesPath}/app.asar`), {
    unpack: '{*.node,config.json}',
    unpackDir: '{static,extensions,bin,packages/shared-process,packages/main-process/node_modules,packages/main-process/pages}',
  })
  await rm(appPath, { recursive: true, force: true })
}
