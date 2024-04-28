import * as BundleEmbedsProcessDependencies from '../BundleEmbedsProcessDependencies/BundleEmbedsProcessDependencies.js'
import * as BundleExtensionHostDependencies from '../BundleExtensionHostDependencies/BundleExtensionHostDependencies.js'
import * as BundleExtensionHostHelperProcessDependencies from '../BundleExtensionHostHelperProcessDependencies/BundleExtensionHostHelperProcessDependencies.js'
import * as BundleMainProcessDependencies from '../BundleMainProcessDependencies/BundleMainProcessDependencies.js'
import * as BundleNetworkProcessDependencies from '../BundleNetworkProcessDependencies/BundleNetworkProcessDependencies.js'
import * as BundleProcessExplorerDependencies from '../BundleProcessExplorerDependencies/BundleProcessExplorerDependencies.js'
import * as BundlePtyHostDependencies from '../BundlePtyHostDependencies/BundlePtyHostDependencies.js'
import * as BundleSharedProcessDependencies from '../BundleSharedProcessDependencies/BundleSharedProcessDependencies.js'

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

const copyEmbedsProcessFiles = async ({ cachePath, arch, electronVersion, platform }) => {
  await BundleEmbedsProcessDependencies.bundleEmbedsProcessDependencies({
    to: `${cachePath}/embeds-process`,
    arch,
    electronVersion,
    exclude: ['ws', '@lvce-editor/web-socket-server'],
    platform,
  })
}

const copyNetworkProcessFiles = async ({ cachePath }) => {
  await BundleNetworkProcessDependencies.bundleNetworkProcessDependencies({
    to: `${cachePath}/network-process`,
    exclude: ['ws', '@lvce-editor/web-socket-server'],
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

export const bundleElectronAppDependencies = async ({
  cachePath,
  arch,
  electronVersion,
  // @ts-ignore
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

  console.time('copyNetworkProcessFiles')
  await copyNetworkProcessFiles({
    cachePath,
  })
  console.timeEnd('copyNetworkProcessFiles')

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
