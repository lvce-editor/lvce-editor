import * as CopyDependencies from '../CopyDependencies/CopyDependencies.js'
import * as FilterSharedProcessDependencies from '../FilterSharedProcessDependencies/FilterSharedProcessDependencies.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as RemoveSourceMaps from '../RemoveSourceMaps/RemoveSourceMaps.js'
import * as RemoveNodePtyFiles from '../RemoveNodePtyFiles/RemoveNodePtyFiles.js'

export const bundleSharedProcessDependencies = async ({ to, arch, electronVersion, exclude = [], platform = process.platform }) => {
  const projectPath = Path.absolute('packages/shared-process')
  const npmDependenciesRaw = await NpmDependencies.getNpmDependenciesRawJson(projectPath)
  const npmDependencies = FilterSharedProcessDependencies.filterDependencies(npmDependenciesRaw, exclude)
  const packageJson = await JsonFile.readJson('packages/shared-process/package.json')
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
  const Rebuild = await import('../Rebuild/Rebuild.js')
  await Rebuild.rebuild({
    arch,
    buildPath: Path.absolute(to),
    electronVersion,
  })
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
  await Remove.remove(`${to}/node_modules/symlink-dir/dist/cli.js`)
  await Remove.remove(`${to}/node_modules/extract-zip/cli.js`)
  await Remove.remove(`${to}/node_modules/@lvce-editor/ipc/dist/browser.js`)
  await RemoveSourceMaps.removeSourceMaps(`${to}/node_modules/cacheable-request`)
  await RemoveSourceMaps.removeSourceMaps(`${to}/node_modules/symlink-dir`)
  await Remove.removeMatching(`${to}/node_modules`, '**/*.d.ts')
  await RemoveNodePtyFiles.removeNodePtyFiles(to, platform)
}
