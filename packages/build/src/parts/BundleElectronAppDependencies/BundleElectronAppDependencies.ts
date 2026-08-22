// @ts-nocheck
import * as BundleMainProcessDependencies from '../BundleMainProcessDependencies/BundleMainProcessDependencies.ts'
import * as BundleSharedProcessDependencies from '../BundleSharedProcessDependencies/BundleSharedProcessDependencies.ts'

const copySharedProcessFiles = async ({ cachePath, arch, electronVersion, platform }) => {
  await BundleSharedProcessDependencies.bundleSharedProcessDependencies({
    to: `${cachePath}/shared-process`,
    arch,
    electronVersion,
    exclude: ['ws', 'trash', 'open', '@lvce-editor/web-socket-server'],
    platform,
  })
}

const copyMainProcessFiles = async ({ arch, electronVersion, cachePath, supportsAutoUpdate, bundleMainProcess }) => {
  await BundleMainProcessDependencies.bundleMainProcessDependencies({
    electronVersion,
    arch,
    to: `${cachePath}/main-process`,
    supportsAutoUpdate,
    bundleMainProcess,
  })
}

export const bundleElectronAppDependencies = async ({
  cachePath,
  arch,
  electronVersion,
  product,
  supportsAutoUpdate,
  bundleMainProcess,
  platform,
  target,
}) => {
  console.time('copySharedProcessFiles')
  await copySharedProcessFiles({
    cachePath,
    arch,
    electronVersion,
    platform,
  })
  console.timeEnd('copySharedProcessFiles')

  console.time('copyMainProcessFiles')
  await copyMainProcessFiles({
    arch,
    electronVersion,
    cachePath,
    supportsAutoUpdate,
    bundleMainProcess,
  })
  console.timeEnd('copyMainProcessFiles')
}
