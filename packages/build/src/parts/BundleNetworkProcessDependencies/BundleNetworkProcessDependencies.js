import * as CopyDependencies from '../CopyDependencies/CopyDependencies.js'
import * as FilterNetworkProcessDependencies from '../FilterNetworkProcessDependencies/FilterNetworkProcessDependencies.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as Path from '../Path/Path.js'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as Remove from '../Remove/Remove.js'
import * as RemoveSourceMaps from '../RemoveSourceMaps/RemoveSourceMaps.js'

const getPrebuildsToKeep = (platform, arch) => {
  if (platform === 'linux' && arch === 'x64') {
    return 'linux-x64'
  }
  if (platform === 'linux' && arch === 'arm') {
    return 'linux-arm64'
  }
  if (platform === 'darwin' && arch === 'x64') {
    return 'darwin-x64'
  }
  if (platform === 'darwin' && arch === 'arm') {
    return 'darwin-arm64'
  }
  if (platform === 'win32') {
    return 'win32-x64'
  }
  return '*'
}

const removeBarePrebuilds = async (to, platform, arch) => {
  const toKeep = getPrebuildsToKeep(platform, arch)
  if (toKeep === '*') {
    return
  }
  const modules = ['bare-fs', 'bare-os']
  for (const module of modules) {
    const dirents = await ReadDir.readDir(`${to}/node_modules/${module}/prebuilds`)
    if (!dirents.includes(toKeep)) {
      throw new Error('missing files to keep')
    }
    for (const dirent of dirents) {
      if (dirent !== toKeep) {
        await Remove.remove(`${to}/node_modules/${module}/prebuilds/${dirent}`)
      }
    }
  }
}

export const bundleNetworkProcessDependencies = async ({ to, exclude = [], arch, platform }) => {
  const projectPath = Path.absolute('packages/network-process')
  const npmDependenciesRaw = await NpmDependencies.getNpmDependenciesRawJson(projectPath)
  const npmDependencies = FilterNetworkProcessDependencies.filterDependencies(npmDependenciesRaw, exclude)
  const packageJson = await JsonFile.readJson('packages/network-process/package.json')
  await JsonFile.writeJson({
    to: `${to}/package.json`,
    value: {
      name: packageJson.name,
      type: packageJson.type,
      dependencies: packageJson.dependencies,
      optionalDependencies: packageJson.optionalDependencies,
    },
  })
  await CopyDependencies.copyDependencies(projectPath, to, npmDependencies)
  await Remove.remove(`${to}/node_modules/nan`)
  await Remove.remove(`${to}/node_modules/node-addon-api`)
  await Remove.remove(`${to}/node_modules/uuid/dist/esm-browser`)
  await Remove.remove(`${to}/node_modules/uuid/dist/umd`)
  await Remove.remove(`${to}/node_modules/uuid/dist/bin`)
  await Remove.remove(`${to}/node_modules/uuid/dist/bin`)
  await Remove.remove(`${to}/node_modules/rimraf/bin.js`)
  await Remove.remove(`${to}/node_modules/which/bin.js`)
  await Remove.remove(`${to}/node_modules/tmp-promise/.circleci`)
  await Remove.remove(`${to}/node_modules/tmp-promise/example-usage.js`)
  await Remove.remove(`${to}/node_modules/tmp-promise/index.test-d.ts`)
  await Remove.remove(`${to}/node_modules/tmp-promise/publish.js`)
  await Remove.remove(`${to}/node_modules/fast-fifo/bench.js`)
  await Remove.remove(`${to}/node_modules/lines-and-columns/build/index.cjs`)
  await Remove.remove(`${to}/node_modules/pump/test-node.js`)
  await Remove.remove(`${to}/node_modules/pump/test-browser.js`)
  await Remove.remove(`${to}/node_modules/inherits/inherits_browser.js`)
  await Remove.remove(`${to}/node_modules/supports-color/browser.js`)
  await Remove.remove(`${to}/node_modules/eventemitter3/umd`)
  await Remove.remove(`${to}/node_modules/@sindresorhus/is/dist/types.js`)
  await Remove.remove(`${to}/node_modules/b4a/browser.js`)
  await Remove.remove(`${to}/node_modules/tail/.nyc_output`)
  await Remove.remove(`${to}/node_modules/which/bin`)
  await Remove.remove(`${to}/node_modules/trash`)
  await Remove.remove(`${to}/node_modules/symlink-dir/dist/cli.js`)
  await Remove.remove(`${to}/node_modules/extract-zip/cli.js`)
  await Remove.remove(`${to}/node_modules/@vscode/node-addon-api`)
  await RemoveSourceMaps.removeSourceMaps(`${to}/node_modules/cacheable-request`)
  await RemoveSourceMaps.removeSourceMaps(`${to}/node_modules/symlink-dir`)
  await Remove.removeMatching(`${to}/node_modules`, '**/*.d.ts')
  await Remove.remove(`${to}/node_modules/bare-os/binding.c`)
  await Remove.remove(`${to}/node_modules/bare-os/CMakeLists.txt`)
  await Remove.remove(`${to}/node_modules/bare-fs/binding.c`)
  await Remove.remove(`${to}/node_modules/bare-fs/CMakeLists.txt`)
  await Remove.remove(`${to}/node_modules/cacheable-request/dist/types.d.ts.map`)
  await Remove.remove(`${to}/node_modules/cacheable-request/dist/index.d.ts.map`)
  await removeBarePrebuilds(to, platform, arch)
}
