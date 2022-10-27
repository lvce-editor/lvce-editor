import { readdir } from 'node:fs/promises'
import * as BundleExtensionHostDependencies from '../BundleExtensionHostDependencies/BundleExtensionHostDependencies.js'
import * as BundleJs from '../BundleJs/BundleJs.js'
import * as BundleMainProcessDependencies from '../BundleMainProcessDependencies/BundleMainProcessDependencies.js'
import * as BundlePtyHostDependencies from '../BundlePtyHostDependencies/BundlePtyHostDependencies.js'
import * as BundleSharedProcessDependencies from '../BundleSharedProcessDependencies/BundleSharedProcessDependencies.js'
import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import * as Product from '../Product/Product.js'
import * as Tag from '../Tag/Tag.js'

const isLanguageBasics = (name) => {
  return name.startsWith('builtin.language-basics')
}

const copyPtyHostFiles = async ({ arch, electronVersion, cachePath }) => {
  await BundlePtyHostDependencies.bundlePtyHostDependencies({
    electronVersion,
    arch,
    to: `${cachePath}/packages/pty-host`,
  })
}

const copyExtensionHostFiles = async ({ cachePath }) => {
  await BundleExtensionHostDependencies.bundleExtensionHostDependencies({
    to: `${cachePath}/packages/extension-host`,
  })
}

const copySharedProcessFiles = async ({ cachePath }) => {
  await BundleSharedProcessDependencies.bundleSharedProcessDependencies({
    to: `${cachePath}/packages/shared-process`,
  })
}

const copyMainProcessFiles = async ({ cachePath }) => {
  await BundleMainProcessDependencies.bundleMainProcessDependencies({
    to: `${cachePath}/packages/main-process`,
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

  for (const dirent of await readdir(
    Path.absolute(`build/.tmp/bundle/electron/extensions`)
  )) {
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

  for (const dirent of await readdir(
    Path.absolute(`build/.tmp/bundle/electron/extensions`)
  )) {
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

const addRootPackageJson = async ({ cachePath }) => {
  const tag = await Tag.getGitTag()
  await JsonFile.writeJson({
    to: `${cachePath}/package.json`,
    value: {
      main: 'packages/main-process/src/mainProcessMain.js',
      name: Product.applicationName,
      productName: Product.nameLong,
      version: tag,
    },
  })
}

export const bundleElectronAppDependencies = async ({
  cachePath,
  arch,
  electronVersion,
}) => {
  console.time('copyPtyHostFiles')
  await copyPtyHostFiles({
    arch,
    electronVersion,
    cachePath,
  })
  console.timeEnd('copyPtyHostFiles')

  console.time('copyExtensionHostFiles')
  await copyExtensionHostFiles({
    cachePath,
  })
  console.timeEnd('copyExtensionHostFiles')

  console.time('copySharedProcessFiles')
  await copySharedProcessFiles({
    cachePath,
  })
  console.timeEnd('copySharedProcessFiles')

  console.time('copyMainProcessFiles')
  await copyMainProcessFiles({
    cachePath,
  })
  console.timeEnd('copyMainProcessFiles')

  console.time('addRootPackageJson')
  await addRootPackageJson({ cachePath })
  console.timeEnd('addRootPackageJson')
}
