import * as BundleExtensionHostDependencies from '../BundleExtensionHostDependencies/BundleExtensionHostDependencies.js'
import * as BundleExtensionHostHelperProcessDependencies from '../BundleExtensionHostHelperProcessDependencies/BundleExtensionHostHelperProcessDependencies.js'
import * as BundleMainProcessDependencies from '../BundleMainProcessDependencies/BundleMainProcessDependencies.js'
import * as BundlePtyHostDependencies from '../BundlePtyHostDependencies/BundlePtyHostDependencies.js'
import * as BundleSearchProcessDependencies from '../BundleSearchProcessDependencies/BundleSearchProcessDependencies.js'
import * as BundleSharedProcessDependencies from '../BundleSharedProcessDependencies/BundleSharedProcessDependencies.js'
import * as BundleTypeScriptCompileProcessDependencies from '../BundleTypeScriptCompileProcessDependencies/BundleTypeScriptCompileProcessDependencies.js'

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

// @ts-ignore
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

const copySearchProcessFiles = async ({ cachePath, target }) => {
  await BundleSearchProcessDependencies.bundleSearchProcessDependencies({
    to: `${cachePath}/search-process`,
    exclude: ['ws', 'trash', 'open', '@lvce-editor/web-socket-server'],
    target,
  })
}

const copyTypeScriptCompileProcessFiles = async ({ cachePath }) => {
  await BundleTypeScriptCompileProcessDependencies.bundleTypeScriptCompileProcessDependencies({
    to: `${cachePath}/typescript-compile-process`,
    exclude: ['ws', '@lvce-editor/web-socket-server'],
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

export const bundleElectronAppDependencies = async ({
  cachePath,
  arch,
  electronVersion,
  // @ts-ignore
  product,
  supportsAutoUpdate,
  bundleMainProcess,
  platform,
  target,
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

  console.time('copySearchProcessFiles')
  await copySearchProcessFiles({
    cachePath,
    target,
  })
  console.timeEnd('copySearchProcessFiles')

  console.time('copyTypeScriptCompileProcessFiles')
  await copyTypeScriptCompileProcessFiles({
    cachePath,
  })
  console.timeEnd('copyTypeScriptCompileProcessFiles')

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
