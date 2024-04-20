import { readdir } from 'node:fs/promises'
import * as BundleEmbedsProcessDependencies from '../BundleEmbedsProcessDependencies/BundleEmbedsProcessDependencies.js'
import * as BundleExtensionHostDependencies from '../BundleExtensionHostDependencies/BundleExtensionHostDependencies.js'
import * as BundleExtensionHostHelperProcessDependencies from '../BundleExtensionHostHelperProcessDependencies/BundleExtensionHostHelperProcessDependencies.js'
import * as BundleMainProcessDependencies from '../BundleMainProcessDependencies/BundleMainProcessDependencies.js'
import * as BundleProcessExplorerDependencies from '../BundleProcessExplorerDependencies/BundleProcessExplorerDependencies.js'
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
    to: `${cachePath}/pty-host`,
    exclude: ['ws', '@lvce-editor/web-socket-server'],
    platform,
  })
}

const copyExtensionHostHelperProcessFiles = async ({ cachePath }) => {
  await BundleExtensionHostHelperProcessDependencies.bundleExtensionHostHelperProcessDependencies({
    to: `${cachePath}/extension-host-helper-process`,
    exclude: ['ws', '@lvce-editor/web-socket-server'],
  })
}

const copyExtensionHostFiles = async ({ cachePath }) => {
  await BundleExtensionHostDependencies.bundleExtensionHostDependencies({
    to: `${cachePath}/extension-host`,
  })
}

const copySharedProcessFiles = async ({ cachePath, arch, electronVersion, platform }) => {
  await BundleSharedProcessDependencies.bundleSharedProcessDependencies({
    to: `${cachePath}/shared-process`,
    arch,
    electronVersion,
    exclude: ['ws', 'trash', 'open', '@lvce-editor/web-socket-server'],
    platform,
  })
}

const copyEmbedsProcessFiles = async ({ cachePath, arch, electronVersion, platform }) => {
  await BundleEmbedsProcessDependencies.bundleEmbedsProcessDependencies({
    to: `${cachePath}/embeds-process`,
    arch,
    electronVersion,
    exclude: ['ws', '@lvce-editor/web-socket-server'],
    platform,
  })
}
const copyProcessExplorerFiles = async ({ cachePath, arch, electronVersion, platform }) => {
  await BundleProcessExplorerDependencies.bundleProcessExplorerDependencies({
    to: `${cachePath}/process-explorer`,
    arch,
    electronVersion,
    exclude: ['ws', '@lvce-editor/web-socket-server'],
    platform,
  })
}

const copyMainProcessFiles = async ({ arch, electronVersion, cachePath, supportsAutoUpdate }) => {
  await BundleMainProcessDependencies.bundleMainProcessDependencies({
    electronVersion,
    arch,
    to: `${cachePath}/main-process`,
    supportsAutoUpdate,
  })
}

const copyResults = async () => {
  await Copy.copy({
    from: `packages/build/.tmp/bundle/electron/packages/renderer-process/src`,
    to: `packages/build/.tmp/bundle/electron-result/resources/app/packages/renderer-process/src`,
  })
  await Copy.copy({
    from: `packages/build/.tmp/bundle/electron/packages/renderer-process/dist`,
    to: `packages/build/.tmp/bundle/electron-result/resources/app/packages/renderer-process/dist`,
  })
  await Copy.copy({
    from: `packages/build/.tmp/bundle/electron/packages/renderer-worker/src`,
    to: `packages/build/.tmp/bundle/electron-result/resources/app/packages/renderer-worker/src`,
  })
  await Copy.copy({
    from: `packages/build/.tmp/bundle/electron/packages/renderer-worker/dist`,
    to: `packages/build/.tmp/bundle/electron-result/resources/app/packages/renderer-worker/dist`,
  })
  const webPackageJson = await JsonFile.readJson('packages/server/package.json')
  await JsonFile.writeJson({
    to: `packages/build/.tmp/bundle/electron-result/resources/app/packages/server/package.json`,
    value: {
      name: webPackageJson.name,
      type: webPackageJson.type,
      dependencies: webPackageJson.dependencies,
    },
  })
  await Copy.copy({
    from: `packages/build/.tmp/bundle/electron/packages/server/src`,
    to: `packages/build/.tmp/bundle/electron-result/resources/app/packages/server/src`,
  })

  await Copy.copy({
    from: `packages/build/.tmp/bundle/electron/static`,
    to: `packages/build/.tmp/bundle/electron-result/resources/app/static`,
  })

  for (const dirent of await readdir(Path.absolute(`packages/build/.tmp/bundle/electron/extensions`))) {
    if (isLanguageBasics(dirent)) {
      await Copy.copy({
        from: `packages/build/.tmp/bundle/electron/extensions/${dirent}`,
        to: `packages/build/.tmp/bundle/electron-result/resources/app/extensions/${dirent}`,
      })
    }
  }
  await Copy.copy({
    from: `packages/build/.tmp/bundle/electron/extensions/builtin.theme-slime`,
    to: `packages/build/.tmp/bundle/electron-result/resources/app/extensions/builtin.theme-slime`,
  })

  for (const dirent of await readdir(Path.absolute(`packages/build/.tmp/bundle/electron/extensions`))) {
    if (!dirent.startsWith('builtin.theme-')) {
      continue
    }
    await Copy.copy({
      from: `packages/build/.tmp/bundle/electron/extensions/${dirent}`,
      to: `packages/build/.tmp/bundle/electron-result/resources/app/extensions/${dirent}`,
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

  console.time('copyEmbedsProcessFiles')
  await copyEmbedsProcessFiles({
    cachePath,
    arch,
    electronVersion,
    platform,
  })
  console.timeEnd('copyEmbedsProcessFiles')

  console.time('copyProcessExplorerFiles')
  await copyProcessExplorerFiles({
    cachePath,
    arch,
    electronVersion,
    platform,
  })
  console.timeEnd('copyProcessExplorerFiles')

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
