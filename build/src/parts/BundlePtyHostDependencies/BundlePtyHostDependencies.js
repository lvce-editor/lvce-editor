import * as CopyDependencies from '../CopyDependencies/CopyDependencies.js'
import * as FilterPtyHostDependencies from '../FilterPtyHostDependencies/FilterPtyHostDependencies.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Remove from '../Remove/Remove.js'

const getNodePtyIgnoreFiles = () => {
  const files = ['typings', 'README.md', 'scripts', 'src']
  if (!Platform.isWindows()) {
    files.push('deps')
  }
  return files
}

export const bundlePtyHostDependencies = async ({ to, arch, electronVersion, exclude = [], platform }) => {
  if (typeof arch !== 'string') {
    throw new TypeError('arch must be defined')
  }
  if (typeof electronVersion !== 'string') {
    throw new TypeError('electron version must be defined')
  }
  const projectPath = Path.absolute('packages/pty-host')
  const packageJson = await JsonFile.readJson('packages/pty-host/package.json')
  await JsonFile.writeJson({
    to: `${to}/package.json`,
    value: {
      name: packageJson.name,
      type: packageJson.type,
      dependencies: packageJson.dependencies,
      optionalDependencies: packageJson.optionalDependencies,
    },
  })
  const rawDependencies = await NpmDependencies.getNpmDependenciesRawJson('packages/pty-host')
  const filteredDependencies = FilterPtyHostDependencies.filterDependencies(rawDependencies, exclude)
  await CopyDependencies.copyDependencies(projectPath, to, filteredDependencies)
  const Rebuild = await import('../Rebuild/Rebuild.js')
  await Rebuild.rebuild({
    arch,
    buildPath: Path.absolute(to),
    electronVersion,
  })
  const nodePtyIgnoreFiles = getNodePtyIgnoreFiles()
  for (const file of nodePtyIgnoreFiles) {
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/${file}`))
  }
  await Remove.remove(Path.absolute(`${to}/node_modules/nan`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/bin`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/binding.gyp`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/node_gyp_bins`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/Release/.deps`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/Release/obj.target`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/Release/.forge-meta`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/binding.Makefile`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/config.gypi`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/Makefile`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/pty.target.mk`))
  await Remove.removeMatching(`${to}/node_modules/node-pty`, '**/*.test.js')
  await Remove.removeMatching(`${to}/node_modules/node-pty`, '**/*.test.js.map')
  if (platform === 'win32') {
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/deps`))
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/deps`))
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/Release/obj`))
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/Release`), '*.iobj')
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/Release`), '*.ipdb')
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/Release`), '*.lib')
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/Release`), '*.pdb')
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/`), '*.sln')
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/`), '*.vcxproj')
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/`), '*.filters')
  }
}
