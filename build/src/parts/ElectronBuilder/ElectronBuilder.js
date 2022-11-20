import * as ElectronBuilder from 'electron-builder'
import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import * as Product from '../Product/Product.js'
import * as Rename from '../Rename/Rename.js'
import * as Stat from '../Stat/Stat.js'
import * as Tag from '../Tag/Tag.js'
import * as Template from '../Template/Template.js'

// TODO don't need to include whole node-pty module
// TODO maybe don't need to include nan module
// TODO don't need to include whole vscode-ripgrep-with-github-api-error-fix module (only path)

const bundleElectronMaybe = async () => {
  if (existsSync(Path.absolute(`build/.tmp/electron-bundle`))) {
    console.info('[electron build skipped]')
    return
  }
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
  await Template.write(config, 'build/.tmp/electron-builder/package.json', {
    '@@NAME@@': Product.applicationName,
    '@@AUTHOR@@': Product.linuxMaintainer,
    '@@VERSION@@': version,
    '@@HOMEPAGE@@': Product.homePage,
    '@@ELECTRON_VERSION@@': electronVersion,
    '@@NAME_LONG@@': Product.nameLong,
    '@@PRODUCT_NAME@@': Product.nameShort,
  })
}

const runElectronBuilder = async () => {
  const debArch = 'amd64'
  await ElectronBuilder.build({
    projectDir: Path.absolute('build/.tmp/electron-builder'),
    prepackaged: Path.absolute(`build/.tmp/linux/snap/${debArch}/app`),
    // win: ['portable'],
  })
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
      return `build/.tmp/electron-builder/dist/${Product.applicationName}Setup.exe`
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
      return `${Product.applicationName}Setup.exe`
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
    console.info(`final size: ${size}`)
  } catch (error) {
    console.warn(error)
    console.log(
      await readdir(Path.absolute('build/.tmp/electron-builder/dist/'))
    )
  }
}

const copyElectronResult = async () => {
  await bundleElectronMaybe()
  const debArch = 'amd64'
  await Copy.copy({
    from: `build/.tmp/electron-bundle/x64`,
    to: `build/.tmp/linux/snap/${debArch}/app`,
  })
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
  const version = await Tag.getGitTag()

  console.time('copyElectronResult')
  await copyElectronResult()
  console.timeEnd('copyElectronResult')

  console.time('copyElectronBuilderConfig')
  await copyElectronBuilderConfig(config, version)
  console.timeEnd('copyElectronBuilderConfig')

  console.time('copyBuildResources')
  await copyBuildResources()
  console.timeEnd('copyBuildResources')

  console.time('runElectronBuilder')
  await runElectronBuilder()
  console.timeEnd('runElectronBuilder')

  console.time('renameReleaseFile')
  const releaseFilePath = await renameReleaseFile(config, version)
  console.timeEnd('renameReleaseFile')

  await printFinalSize(releaseFilePath)
}
