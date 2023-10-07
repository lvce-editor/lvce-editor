import * as CopyDependencies from '../CopyDependencies/CopyDependencies.js'
import * as FilterMainProcessDependencies from '../FilterMainProcessDependencies/FilterMainProcessDependencies.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Remove from '../Remove/Remove.js'
import * as RemoveSourceMaps from '../RemoveSourceMaps/RemoveSourceMaps.js'

export const bundleMainProcessDependencies = async ({ to, arch, electronVersion, supportsAutoUpdate }) => {
  const mainProcessPath = Path.absolute('packages/main-process')
  const packageJson = await JsonFile.readJson('packages/main-process/package.json')
  await JsonFile.writeJson({
    to: `${to}/package.json`,
    value: {
      name: packageJson.name,
      type: packageJson.type,
      dependencies: packageJson.dependencies,
    },
  })
  const npmDependenciesRaw = await NpmDependencies.getNpmDependenciesRawJson('packages/main-process')
  const npmDependencies = FilterMainProcessDependencies.filterDependencies(npmDependenciesRaw, supportsAutoUpdate)
  await CopyDependencies.copyDependencies(mainProcessPath, to, npmDependencies)
  if (Platform.isWindows()) {
    const Rebuild = await import('../Rebuild/Rebuild.js')
    await Rebuild.rebuild({
      arch,
      buildPath: Path.absolute(to),
      electronVersion,
    })
  }
  await Remove.remove(`${to}/node_modules/debug/src/browser.js`)
  await Remove.remove(`${to}/node_modules/clean-stack/home-directory-browser.js`)
  await Remove.remove(`${to}/node_modules/minimist/example`)
  await Remove.remove(`${to}/node_modules/lines-and-columns/index.d.ts`)
  await Remove.remove(`${to}/node_modules/supports-color/browser.js`)
  for (const dependency of ['@babel/code-frame', '@babel/helper-validator-identifier', '@babel/highlight']) {
    const absolutePath = Path.join(to, 'node_modules', dependency)
    await RemoveSourceMaps.removeSourceMaps(absolutePath)
  }
}
