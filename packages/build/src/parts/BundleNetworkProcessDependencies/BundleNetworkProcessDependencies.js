import * as CopyDependencies from '../CopyDependencies/CopyDependencies.js'
import * as FilterNetworkProcessDependencies from '../FilterNetworkProcessDependencies/FilterNetworkProcessDependencies.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as RemoveSourceMaps from '../RemoveSourceMaps/RemoveSourceMaps.js'

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
  if (arch === 'x64') {
    await Remove.remove(`${to}/node_modules/bare-fs/prebuilds/linux-arm64`)
    await Remove.remove(`${to}/node_modules/bare-os/prebuilds/linux-arm64`)
  } else {
    await Remove.remove(`${to}/node_modules/bare-fs/prebuilds/linux-x64`)
    await Remove.remove(`${to}/node_modules/bare-os/prebuilds/linux-x64`)
  }
}
