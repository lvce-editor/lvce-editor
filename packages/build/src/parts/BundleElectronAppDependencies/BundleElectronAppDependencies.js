// @ts-nocheck
import * as CopyDependencies from '../CopyDependencies/CopyDependencies.js'
import * as BundleExtensionHostDependencies from '../BundleExtensionHostDependencies/BundleExtensionHostDependencies.js'
import * as BundleExtensionHostHelperProcessDependencies from '../BundleExtensionHostHelperProcessDependencies/BundleExtensionHostHelperProcessDependencies.js'
import * as BundleMainProcessDependencies from '../BundleMainProcessDependencies/BundleMainProcessDependencies.js'
import * as BundleSharedProcessDependencies from '../BundleSharedProcessDependencies/BundleSharedProcessDependencies.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'

const mainProcessRelaunchDependencies = new Set(['@electron/get', 'extract-zip'])

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

const copyMainProcessFiles = async ({ arch, electronVersion, cachePath, supportsAutoUpdate }) => {
  await BundleMainProcessDependencies.bundleMainProcessDependencies({
    electronVersion,
    arch,
    to: `${cachePath}/main-process`,
    supportsAutoUpdate,
  })
}

const getVisibleDependencies = (dependency) => {
  if (dependency.dependencies) {
    return Object.values(dependency.dependencies)
  }
  return []
}

const getMainProcessRelaunchDependencyPaths = (rawDependencies) => {
  const dependencyPaths = []
  const walk = (dependency, include) => {
    const shouldInclude = include || mainProcessRelaunchDependencies.has(dependency.name)
    if (shouldInclude && dependency.path && dependency.name && !dependency.name.includes('@types')) {
      dependencyPaths.push(dependency.path)
    }
    for (const child of getVisibleDependencies(dependency)) {
      walk(child, shouldInclude)
    }
  }
  walk(rawDependencies, false)
  return dependencyPaths
}

const copyMainProcessRelaunchDependencies = async ({ cachePath }) => {
  const npmDependenciesRaw = await NpmDependencies.getNpmDependenciesRawJson('packages/main-process')
  const npmDependencies = getMainProcessRelaunchDependencyPaths(npmDependenciesRaw)
  await CopyDependencies.copyDependencies('packages/main-process', `${cachePath}/main-process`, npmDependencies)
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

  if (bundleMainProcess) {
    console.time('copyMainProcessRelaunchDependencies')
    await copyMainProcessRelaunchDependencies({
      cachePath,
    })
    console.timeEnd('copyMainProcessRelaunchDependencies')
  }
}
