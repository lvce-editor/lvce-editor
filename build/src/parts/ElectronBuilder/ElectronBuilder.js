import * as ElectronBuilder from 'electron-builder'
import { readdir } from 'node:fs/promises'
import VError from 'verror'
import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Product from '../Product/Product.js'
import * as Rename from '../Rename/Rename.js'
import * as Replace from '../Replace/Replace.js'
import * as Stat from '../Stat/Stat.js'
import * as Tag from '../Tag/Tag.js'
import * as Template from '../Template/Template.js'

// TODO don't need to include whole node-pty module
// TODO maybe don't need to include nan module
// TODO don't need to include whole vscode-ripgrep-with-github-api-error-fix module (only path)

const bundleElectronMaybe = async () => {
  // if (existsSync(Path.absolute(`build/.tmp/electron-bundle`))) {
  //   Logger.info('[electron build skipped]')
  //   return
  // }
  const { build } = await import('../BundleElectronApp/BundleElectronApp.js')
  await build()
}

const getElectronVersion = async () => {
  const parsed = await JsonFile.readJson('packages/main-process/package.json')
  const version = parsed.devDependencies.electron
  const parsedVersion = version.startsWith('^') ? version.slice(1) : version
  return parsedVersion
}

const copyElectronBuilderConfig = async (config, version) => {
  const electronVersion = await getElectronVersion()
  // if (config === 'electron_builder_arch_linux') {
  //   version = version.replaceAll('-', '_') // https://wiki.archlinux.org/title/creating_packages#pkgver()
  // }
  await Template.write(config, 'build/.tmp/electron-builder/package.json', {
    '@@NAME@@': Product.applicationName,
    '@@AUTHOR@@': Product.linuxMaintainer,
    '@@VERSION@@': version,
    '@@HOMEPAGE@@': Product.homePage,
    '@@ELECTRON_VERSION@@': electronVersion,
    '@@NAME_LONG@@': Product.nameLong,
    '@@LICENSE@@': Product.licenseName,
  })
}

const runElectronBuilder = async ({ config }) => {
  try {
    const debArch = 'amd64'

    const options = {
      projectDir: Path.absolute('build/.tmp/electron-builder'),
      prepackaged: Path.absolute(`build/.tmp/linux/snap/${debArch}/app`),
      // win: ['portable'],
    }
    await ElectronBuilder.build(options)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Electron builder failed to execute`)
  }
}

const copyBuildResources = async () => {
  await Copy.copyFile({
    from: `build/files/icon.png`,
    to: 'build/.tmp/electron-builder/build/icon.png',
  })
  await Copy.copyFile({
    from: `build/files/icon.png`,
    to: 'build/.tmp/electron-builder/build/icons/512x512.png',
  })
}

const getFinalFileName = (config, version) => {
  switch (config) {
    case 'electron_builder_arch_linux':
      return `build/.tmp/electron-builder/dist/${Product.applicationName}-${version}.pacman`
    case 'electron_builder_deb':
      return `build/.tmp/electron-builder/dist/${Product.applicationName}_${version}_amd64.deb`
    case 'electron_builder_windows_exe':
      return `build/.tmp/electron-builder/dist/${Product.applicationName} Setup ${version}.exe`
    case 'electron_builder_snap':
      return `build/.tmp/electron-builder/dist/${Product.applicationName}_${version}_amd64.snap`
    case 'electron_builder_mac':
      return `build/.tmp/electron-builder/dist/${Product.applicationName}_${version}_amd64.dmg`
    default:
      throw new Error(`cannot get final file name for target ${config}`)
  }
}

const getReleaseFileName = (config) => {
  switch (config) {
    case 'electron_builder_arch_linux':
      return `${Product.applicationName}.pacman`
    case 'electron_builder_deb':
      return `${Product.applicationName}-amd64.deb`
    case 'electron_builder_windows_exe':
      return `${Product.applicationName}.exe`
    case 'electron_builder_snap':
      return `${Product.applicationName}.snap`
    case 'electron_builder_mac':
      return `${Product.applicationName}-amd64.dmg`
    default:
      throw new Error(`cannot get final file name for target ${config}`)
  }
}

const printFinalSize = async (releaseFilePath) => {
  try {
    const size = await Stat.getFileSize(releaseFilePath)
    Logger.info(`final size: ${size}`)
  } catch (error) {
    console.warn(error)
    console.log(
      await readdir(Path.absolute('build/.tmp/electron-builder/dist/'))
    )
  }
}

const addRootPackageJson = async ({ cachePath, version }) => {
  await JsonFile.writeJson({
    to: `${cachePath}/package.json`,
    value: {
      main: 'packages/main-process/src/mainProcessMain.js',
      name: Product.applicationName,
      productName: Product.nameLong,
      version: version,
    },
  })
}

const copyElectronResult = async ({ config, version }) => {
  await bundleElectronMaybe()
  const debArch = 'amd64'
  await Copy.copy({
    from: `build/.tmp/electron-bundle/x64`,
    to: `build/.tmp/linux/snap/${debArch}/app`,
  })
  await addRootPackageJson({
    cachePath: `build/.tmp/linux/snap/${debArch}/app/resources/app`,
    version,
  })
  if (config === 'electron_builder_arch_linux') {
    await Replace.replace({
      path: `build/.tmp/linux/snap/${debArch}/app/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
      occurrence: `exports.isArchLinux = false`,
      replacement: `exports.isArchLinux = true`,
    })
  }
}

const renameReleaseFile = async (config, version) => {
  const finalFileName = getFinalFileName(config, version)
  const releaseFileName = getReleaseFileName(config)
  const releaseFilePath = `build/.tmp/releases/${releaseFileName}`
  await Rename.rename({
    from: finalFileName,
    to: releaseFilePath,
  })
  return releaseFilePath
}

export const build = async ({ config }) => {
  // workaround for https://github.com/electron-userland/electron-builder/issues/4594
  // @ts-ignore
  process.env.USE_HARD_LINKS = false
  const version = await Tag.getSemverVersion()

  console.time('copyElectronResult')
  await copyElectronResult({ version, config })
  console.timeEnd('copyElectronResult')

  console.time('copyElectronBuilderConfig')
  await copyElectronBuilderConfig(config, version)
  console.timeEnd('copyElectronBuilderConfig')

  console.time('copyBuildResources')
  await copyBuildResources()
  console.timeEnd('copyBuildResources')

  console.time('runElectronBuilder')
  await runElectronBuilder({ config })
  console.timeEnd('runElectronBuilder')

  console.time('renameReleaseFile')
  const releaseFilePath = await renameReleaseFile(config, version)
  console.timeEnd('renameReleaseFile')

  await printFinalSize(releaseFilePath)
}
