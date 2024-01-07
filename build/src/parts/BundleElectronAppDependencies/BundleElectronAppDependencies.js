import { readdir } from 'node:fs/promises'
import * as BundleExtensionHostDependencies from '../BundleExtensionHostDependencies/BundleExtensionHostDependencies.js'
import * as BundleExtensionHostHelperProcessDependencies from '../BundleExtensionHostHelperProcessDependencies/BundleExtensionHostHelperProcessDependencies.js'
import * as BundleJs from '../BundleJs/BundleJs.js'
import * as BundleMainProcessDependencies from '../BundleMainProcessDependencies/BundleMainProcessDependencies.js'
import * as BundlePtyHostDependencies from '../BundlePtyHostDependencies/BundlePtyHostDependencies.js'
import * as BundleSharedProcessDependencies from '../BundleSharedProcessDependencies/BundleSharedProcessDependencies.js'
import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'

const isLanguageBasics = (name) => {
  return name.startsWith('builtin.language-basics')
}

const copyPtyHostFiles = async ({ arch, electronVersion, cachePath, platform }) => {
  await BundlePtyHostDependencies.bundlePtyHostDependencies({
    electronVersion,
    arch,
    to: `${cachePath}/packages/pty-host`,
    exclude: ['ws', '@lvce-editor/web-socket-server'],
    platform,
  })
}

const copyExtensionHostHelperProcessFiles = async ({ cachePath }) => {
  await BundleExtensionHostHelperProcessDependencies.bundleExtensionHostHelperProcessDependencies({
    to: `${cachePath}/packages/extension-host-helper-process`,
    exclude: ['ws', '@lvce-editor/web-socket-server'],
  })
}

const copyExtensionHostFiles = async ({ cachePath }) => {
  await BundleExtensionHostDependencies.bundleExtensionHostDependencies({
    to: `${cachePath}/packages/extension-host`,
  })
}

const copySharedProcessFiles = async ({ cachePath, arch, electronVersion, platform }) => {
  await BundleSharedProcessDependencies.bundleSharedProcessDependencies({
    to: `${cachePath}/packages/shared-process`,
    arch,
    electronVersion,
    exclude: ['ws', 'trash', 'open', '@lvce-editor/web-socket-server'],
    platform,
  })
}

const copyMainProcessFiles = async ({ arch, electronVersion, cachePath, supportsAutoUpdate }) => {
  await BundleMainProcessDependencies.bundleMainProcessDependencies({
    electronVersion,
    arch,
    to: `${cachePath}/packages/main-process`,
    supportsAutoUpdate,
  })
}

const bundleJs = async () => {
  await BundleJs.bundleJs({
    cwd: Path.absolute(`build/.tmp/bundle/electron/packages/renderer-worker`),
    from: `./src/rendererWorkerMain.js`,
    platform: 'webworker',
  })
}

const copyResults = async () => {
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/renderer-process/src`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/renderer-process/src`,
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/renderer-process/dist`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/renderer-process/dist`,
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/renderer-worker/src`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/renderer-worker/src`,
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/renderer-worker/dist`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/renderer-worker/dist`,
  })
  const webPackageJson = await JsonFile.readJson('packages/server/package.json')
  await JsonFile.writeJson({
    to: `build/.tmp/bundle/electron-result/resources/app/packages/server/package.json`,
    value: {
      name: webPackageJson.name,
      type: webPackageJson.type,
      dependencies: webPackageJson.dependencies,
    },
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/server/src`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/server/src`,
  })

  await Copy.copy({
    from: `build/.tmp/bundle/electron/static`,
    to: `build/.tmp/bundle/electron-result/resources/app/static`,
  })

  for (const dirent of await readdir(Path.absolute(`build/.tmp/bundle/electron/extensions`))) {
    if (isLanguageBasics(dirent)) {
      await Copy.copy({
        from: `build/.tmp/bundle/electron/extensions/${dirent}`,
        to: `build/.tmp/bundle/electron-result/resources/app/extensions/${dirent}`,
      })
    }
  }
  await Copy.copy({
    from: `build/.tmp/bundle/electron/extensions/builtin.theme-slime`,
    to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.theme-slime`,
  })

  for (const dirent of await readdir(Path.absolute(`build/.tmp/bundle/electron/extensions`))) {
    if (!dirent.startsWith('builtin.theme-')) {
      continue
    }
    await Copy.copy({
      from: `build/.tmp/bundle/electron/extensions/${dirent}`,
      to: `build/.tmp/bundle/electron-result/resources/app/extensions/${dirent}`,
      ignore: ['node_modules', 'test', 'package-lock.json'],
    })
  }
}

export const bundleElectronAppDependencies = async ({
  cachePath,
  arch,
  electronVersion,
  product,
  supportsAutoUpdate,
  bundleMainProcess,
  platform,
}) => {
  console.time('copyPtyHostFiles')
  await copyPtyHostFiles({
    arch,
    electronVersion,
    cachePath,
    platform,
  })
  console.timeEnd('copyPtyHostFiles')

  console.time('copyExtensionHostHelperProcessFiles')
  await copyExtensionHostHelperProcessFiles({
    cachePath,
  })
  console.timeEnd('copyExtensionHostHelperProcessFiles')

  console.time('copySharedProcessFiles')
  await copySharedProcessFiles({
    cachePath,
    arch,
    electronVersion,
    platform,
  })
  console.timeEnd('copySharedProcessFiles')

  if (!bundleMainProcess) {
    console.time('copyMainProcessFiles')
    await copyMainProcessFiles({
      arch,
      electronVersion,
      cachePath,
      supportsAutoUpdate,
    })
    console.timeEnd('copyMainProcessFiles')
  }
}
