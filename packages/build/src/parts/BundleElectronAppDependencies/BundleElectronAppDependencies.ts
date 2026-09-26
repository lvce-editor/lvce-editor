// @ts-nocheck
import * as BundleMainProcessDependencies from '../BundleMainProcessDependencies/BundleMainProcessDependencies.ts'
import * as BundleSharedProcessDependencies from '../BundleSharedProcessDependencies/BundleSharedProcessDependencies.ts'
import * as CopyDependencies from '../CopyDependencies/CopyDependencies.ts'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.ts'

const electronVersionDependencyNames = new Set(['@electron/get', 'extract-zip'])

const copyElectronVersionDependencies = async (cachePath) => {
  const rawDependencies = await NpmDependencies.getNpmDependenciesRawJson('packages/main-process')
  const dependencyPaths = []
  const visit = (dependency, include = false) => {
    const includeDependency = include || electronVersionDependencyNames.has(dependency.name)
    if (includeDependency && dependency.path && dependency.name && !dependency.name.includes('@types')) {
      dependencyPaths.push(dependency.path)
    }
    for (const child of Object.values(dependency.dependencies || {})) {
      visit(child, includeDependency)
    }
  }
  visit(rawDependencies)
  await CopyDependencies.copyDependencies('packages/main-process', `${cachePath}/main-process`, dependencyPaths)
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

  if (bundleMainProcess) {
    console.time('copyElectronVersionDependencies')
    await copyElectronVersionDependencies(cachePath)
    console.timeEnd('copyElectronVersionDependencies')
  }
}
