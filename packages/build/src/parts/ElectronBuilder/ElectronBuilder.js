import { VError } from '@lvce-editor/verror'
import * as ElectronBuilder from 'electron-builder'
import { readdir } from 'node:fs/promises'
import * as AddRootPackageJson from '../AddRootPackageJson/AddRootPackageJson.js'
import * as Assert from '../Assert/Assert.js'
import * as BundleOptions from '../BundleOptions/BundleOptions.js'
import * as Copy from '../Copy/Copy.js'
import * as CreatePlaceholderElectronApp from '../CreatePlaceholderElectronApp/CreatePlaceholderElectronApp.js'
import * as ElectronBuilderConfigType from '../ElectronBuilderConfigType/ElectronBuilderConfigType.js'
import * as FileExtension from '../FileExtension/FileExtension.js'
import * as GetElectronVersion from '../GetElectronVersion/GetElectronVersion.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Rename from '../Rename/Rename.js'
import * as Replace from '../Replace/Replace.js'
import * as Stat from '../Stat/Stat.js'
import * as Tag from '../Tag/Tag.js'
import * as Template from '../Template/Template.js'

// TODO don't need to include whole node-pty module
// TODO maybe don't need to include nan module
// TODO don't need to include whole @lvce-editor/ripgrep module (only path)

const bundleElectronMaybe = async ({
  product,
  version,
  supportsAutoUpdate,
  shouldRemoveUnusedLocales,
  isMacos,
  arch,
  platform,
  isArchLinux,
  isAppImage,
}) => {
  // if (existsSync(Path.absolute(`packages/build/.tmp/electron-bundle`))) {
  //   Logger.info('[electron build skipped]')
  //   return
  // }
  const { build } = await import('../BundleElectronApp/BundleElectronApp.js')
  await build({ product, version, supportsAutoUpdate, shouldRemoveUnusedLocales, isMacos, arch, platform, isArchLinux, isAppImage, target: '' })
}

const copyElectronBuilderConfig = async ({ config, version, product, electronVersion, bundleMainProcess }) => {
  // if (config === 'electron_builder_arch_linux') {
  //   version = version.replaceAll('-', '_') // https://wiki.archlinux.org/title/creating_packages#pkgver()
  // }
  const mainProcessPath = bundleMainProcess ? `packages/main-process/dist/mainProcessMain.js` : `packages/main-process/src/mainProcessMain.js`
  await Template.write(config, 'packages/build/.tmp/electron-builder/package.json', {
    '@@SNAP_NAME@@': product.snapName,
    '@@NAME@@': product.applicationName,
    '@@AUTHOR@@': product.linuxMaintainer,
    '@@VERSION@@': version,
    '@@HOMEPAGE@@': product.homePage,
    '@@ELECTRON_VERSION@@': electronVersion,
    '@@NAME_LONG@@': product.nameLong,
    '@@LICENSE@@': product.licenseName,
    '@@PRODUCT_NAME@@': product.nameLong,
    '@@WINDOWS_EXECUTABLE_NAME@@': product.windowsExecutableName,
    '@@MAIN@@': mainProcessPath,
  })
}

const runElectronBuilder = async ({ config, arch }) => {
  try {
    const debArch = 'amd64'

    /**
     * @type {ElectronBuilder.CliOptions}
     */
    const options = {
      projectDir: Path.absolute('packages/build/.tmp/electron-builder'),
      prepackaged: Path.absolute(`packages/build/.tmp/linux/snap/${debArch}/app`),
      publish: 'never',
      arm64: arch === 'arm64',

      // win: ['portable'],
    }
    // if (process.env.HIGHEST_COMPRESSION) {
    //   Logger.info('[info] using highest compression, this may take some time')
    //   process.env.ELECTRON_BUILDER_7Z_FILTER = 'bcj2'
    //   process.env.ELECTRON_BUILDER_COMPRESSION_LEVEL = '5'
    // }
    await ElectronBuilder.build(options)
  } catch (error) {
    throw new VError(error, `Electron builder failed to execute`)
  }
}

const copyBuildResources = async ({ config }) => {
  await Copy.copyFile({
    from: `packages/build/files/icon.png`,
    to: 'packages/build/.tmp/electron-builder/build/icon.png',
  })
  await Copy.copy({
    from: 'packages/build/files/icons',
    to: 'packages/build/.tmp/electron-builder/build/icons',
  })
  if (config === ElectronBuilderConfigType.WindowsExe) {
    await Copy.copyFile({
      from: `packages/build/files/windows/installer.nsh`,
      to: `packages/build/.tmp/electron-builder/build/installer.nsh`,
    })
    await Copy.copyFile({
      from: `packages/build/files/windows/EnvVarUpdate.nsh`,
      to: `packages/build/.tmp/electron-builder/build/EnvVarUpdate.nsh`,
    })
    await Copy.copyFile({
      from: `packages/build/files/icon.ico`,
      to: 'packages/build/.tmp/electron-builder/build/icon.ico',
    })
  }
}

const getFinalFileName = ({ config, version, product, arch }) => {
  switch (config) {
    case ElectronBuilderConfigType.ArchLinux:
      return `packages/build/.tmp/electron-builder/dist/${product.applicationName}-${version}.${FileExtension.Pacman}`
    case ElectronBuilderConfigType.Deb:
      return `packages/build/.tmp/electron-builder/dist/${product.applicationName}_${version}_amd64.${FileExtension.Deb}`
    case ElectronBuilderConfigType.WindowsExe:
      return `packages/build/.tmp/electron-builder/dist/${product.windowsExecutableName} Setup ${version}.${FileExtension.Exe}`
    case ElectronBuilderConfigType.Snap:
      return `packages/build/.tmp/electron-builder/dist/${product.snapName}_${version}_amd64.${FileExtension.Snap}`
    case ElectronBuilderConfigType.Mac:
      if (arch === 'arm64') {
        return `packages/build/.tmp/electron-builder/dist/${product.applicationName}-${version}-arm64.${FileExtension.Dmg}`
      }
      throw new Error('macos x64 is not yet supported')
    case ElectronBuilderConfigType.AppImage:
      return `packages/build/.tmp/electron-builder/dist/${product.applicationName}-${version}.${FileExtension.AppImage}`
    default:
      throw new Error(`cannot get final file name for target ${config}`)
  }
}

const getReleaseFileName = ({ config, product, arch }) => {
  switch (config) {
    case ElectronBuilderConfigType.ArchLinux:
      return `${product.applicationName}.pacman`
    case ElectronBuilderConfigType.Deb:
      return `${product.applicationName}-amd64.deb`
    case ElectronBuilderConfigType.WindowsExe:
      if (arch === 'x64') {
        return `${product.windowsExecutableName}-x64.exe`
      }
      if (arch === 'arm64') {
        return `${product.windowsExecutableName}-arm64.exe`
      }
      return `${product.windowsExecutableName}.exe`
    case ElectronBuilderConfigType.Snap:
      return `${product.snapName}.snap`
    case ElectronBuilderConfigType.Mac:
      if (arch === 'x64') {
        return `${product.applicationName}-amd64.dmg`
      }
      if (arch === 'arm64') {
        return `${product.applicationName}-arm64.dmg`
      }
      return `${product.applicationName}-amd64.dmg`
    case ElectronBuilderConfigType.AppImage:
      return `${product.applicationName}.AppImage`
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
    console.log(await readdir(Path.absolute('packages/build/.tmp/electron-builder/dist/')))
  }
}

const getRepositoryInfo = (url) => {
  const RE_URL = /github\.com\/(.*)\/(.*)/
  const match = url.match(RE_URL)
  if (!match) {
    throw new Error(`failed to parse repository info`)
  }
  return {
    owner: match[1],
    repoName: match[2],
  }
}

const copyElectronResult = async ({
  config,
  version,
  product,
  electronVersion,
  supportsAutoUpdate,
  shouldRemoveUnusedLocales,
  bundleMainProcess,
  isMacos,
  arch = 'x64',
  platform,
  isArchLinux,
  isAppImage,
}) => {
  await bundleElectronMaybe({
    product,
    version,
    supportsAutoUpdate,
    shouldRemoveUnusedLocales,
    isMacos,
    arch,
    platform,
    isArchLinux,
    isAppImage,
  })
  const debArch = 'amd64'
  const resourcesPath = isMacos
    ? `packages/build/.tmp/linux/snap/${debArch}/app/${product.applicationName}.app/Contents/Resources`
    : `packages/build/.tmp/linux/snap/${debArch}/app/resources`
  await Remove.remove(`packages/build/.tmp/linux/snap/${debArch}/app`)
  await Copy.copy({
    from: `packages/build/.tmp/electron-bundle/${arch}`,
    to: `packages/build/.tmp/linux/snap/${debArch}/app`,
  })
  await AddRootPackageJson.addRootPackageJson({
    cachePath: `${resourcesPath}/app`,
    version,
    product,
    bundleMainProcess,
    electronVersion,
  })
  if (supportsAutoUpdate) {
    await Replace.replace({
      path: `${resourcesPath}/app/packages/shared-process/src/parts/IsAutoUpdateSupported/IsAutoUpdateSupported.js`,
      occurrence: `return Platform.isWindows || Platform.isMacOs`,
      replacement: `return true`,
    })
    // workaround for https://github.com/electron-userland/electron-builder/issues/2761
    const { owner, repoName } = getRepositoryInfo(product.repoUrl)
    await Template.write('electron_builder_app_update_yaml', `packages/build/.tmp/linux/snap/${debArch}/app/resources/app-update.yml`, {
      '@@OWNER@@': owner,
      '@@REPO_NAME@@': repoName,
    })
  } else {
    await Replace.replace({
      path: `${resourcesPath}/app/packages/shared-process/src/parts/IsAutoUpdateSupported/IsAutoUpdateSupported.js`,
      occurrence: `return Platform.isWindows || Platform.isMacOs`,
      replacement: `return false`,
    })
  }
  if (config === ElectronBuilderConfigType.WindowsExe) {
    await Template.write('windows_cmd', `packages/build/.tmp/linux/snap/${debArch}/app/bin/${product.applicationName}.cmd`, {
      '@@WINDOWS_EXECUTABLE_NAME@@': product.windowsExecutableName,
    })
    await Template.write('windows_cli_bash', `packages/build/.tmp/linux/snap/${debArch}/app/bin/${product.applicationName}`, {
      '@@WINDOWS_EXECUTABLE_NAME@@': product.windowsExecutableName,
    })
    await CreatePlaceholderElectronApp.createPlaceholderElectronApp({ product, version, config, electronVersion })
    await Copy.copyFile({
      from: `packages/build/.tmp/electron-builder-placeholder-app/dist/win-unpacked/${product.windowsExecutableName}.exe`,
      to: `packages/build/.tmp/linux/snap/${debArch}/app/${product.windowsExecutableName}.exe`,
    })
  }
}

const renameReleaseFile = async ({ config, version, product, arch }) => {
  const finalFileName = getFinalFileName({ config, version, product, arch })
  const releaseFileName = getReleaseFileName({ config, product, arch })
  const releaseFilePath = `packages/build/.tmp/releases/${releaseFileName}`
  await Rename.rename({
    from: finalFileName,
    to: releaseFilePath,
  })
  return releaseFilePath
}

export const build = async ({
  config,
  product,
  shouldRemoveUnusedLocales = false,
  arch,
  isMacos = false,
  platform = process.platform,
  isArchLinux,
  isAppImage,
}) => {
  Assert.string(config)
  Assert.object(product)
  // workaround for https://github.com/electron-userland/electron-builder/issues/4594
  // @ts-ignore
  process.env.USE_HARD_LINKS = false
  const version = await Tag.getSemverVersion()
  const { electronVersion } = await GetElectronVersion.getElectronVersion()
  const bundleMainProcess = BundleOptions.bundleMainProcess

  const supportsAutoUpdate =
    product.supportsAutoUpdate && (config === ElectronBuilderConfigType.AppImage || config === ElectronBuilderConfigType.WindowsExe)

  console.time('copyElectronResult')
  await copyElectronResult({
    version,
    config,
    product,
    electronVersion,
    supportsAutoUpdate,
    shouldRemoveUnusedLocales,
    bundleMainProcess,
    isMacos,
    arch,
    platform,
    isArchLinux,
    isAppImage,
  })
  console.timeEnd('copyElectronResult')

  console.time('copyElectronBuilderConfig')
  await copyElectronBuilderConfig({ config, version, product, electronVersion, bundleMainProcess })
  console.timeEnd('copyElectronBuilderConfig')

  console.time('copyBuildResources')
  await copyBuildResources({ config })
  console.timeEnd('copyBuildResources')

  console.time('runElectronBuilder')
  await runElectronBuilder({ config, arch })
  console.timeEnd('runElectronBuilder')

  console.time('renameReleaseFile')
  const releaseFilePath = await renameReleaseFile({ config, version, product, arch })
  console.timeEnd('renameReleaseFile')

  await printFinalSize(releaseFilePath)
}
