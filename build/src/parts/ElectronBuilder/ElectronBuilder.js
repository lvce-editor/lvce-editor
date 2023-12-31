import { VError } from '@lvce-editor/verror'
import * as ElectronBuilder from 'electron-builder'
import { readdir } from 'node:fs/promises'
import * as AddRootPackageJson from '../AddRootPackageJson/AddRootPackageJson.js'
import * as Assert from '../Assert/Assert.js'
import * as BundleOptions from '../BundleOptions/BundleOptions.js'
import * as Copy from '../Copy/Copy.js'
import * as CreatePlaceholderElectronApp from '../CreatePlaceholderElectronApp/CreatePlaceholderElectronApp.js'
import * as ElectronBuilderConfigType from '../ElectronBuilderConfigType/ElectronBuilderConfigType.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Rename from '../Rename/Rename.js'
import * as Replace from '../Replace/Replace.js'
import * as Stat from '../Stat/Stat.js'
import * as Tag from '../Tag/Tag.js'
import * as Template from '../Template/Template.js'
import * as FileExtension from '../FileExtension/FileExtension.js'

// TODO don't need to include whole node-pty module
// TODO maybe don't need to include nan module
// TODO don't need to include whole @lvce-editor/ripgrep module (only path)

const bundleElectronMaybe = async ({ product, version, supportsAutoUpdate, shouldRemoveUnusedLocales, isMacos, platform }) => {
  // if (existsSync(Path.absolute(`build/.tmp/electron-bundle`))) {
  //   Logger.info('[electron build skipped]')
  //   return
  // }
  const { build } = await import('../BundleElectronApp/BundleElectronApp.js')
  await build({ product, version, supportsAutoUpdate, shouldRemoveUnusedLocales, isMacos, platform })
}

const getElectronVersion = async () => {
  const parsed = await JsonFile.readJson('packages/main-process/package.json')
  const version = parsed.devDependencies.electron
  const parsedVersion = version.startsWith('^') ? version.slice(1) : version
  return parsedVersion
}

const copyElectronBuilderConfig = async ({ config, version, product, electronVersion, bundleMainProcess }) => {
  // if (config === 'electron_builder_arch_linux') {
  //   version = version.replaceAll('-', '_') // https://wiki.archlinux.org/title/creating_packages#pkgver()
  // }
  const mainProcessPath = bundleMainProcess ? `packages/main-process/dist/mainProcessMain.js` : `packages/main-process/src/mainProcessMain.js`
  await Template.write(config, 'build/.tmp/electron-builder/package.json', {
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

const runElectronBuilder = async ({ config }) => {
  try {
    const debArch = 'amd64'

    /**
     * @type {ElectronBuilder.CliOptions}
     */
    const options = {
      projectDir: Path.absolute('build/.tmp/electron-builder'),
      prepackaged: Path.absolute(`build/.tmp/linux/snap/${debArch}/app`),
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
    from: `build/files/icon.png`,
    to: 'build/.tmp/electron-builder/build/icon.png',
  })
  await Copy.copy({
    from: 'build/files/icons',
    to: 'build/.tmp/electron-builder/build/icons',
  })
  if (config === ElectronBuilderConfigType.WindowsExe) {
    await Copy.copyFile({
      from: `build/files/windows/installer.nsh`,
      to: `build/.tmp/electron-builder/build/installer.nsh`,
    })
    await Copy.copyFile({
      from: `build/files/windows/EnvVarUpdate.nsh`,
      to: `build/.tmp/electron-builder/build/EnvVarUpdate.nsh`,
    })
    await Copy.copyFile({
      from: `build/files/icon.ico`,
      to: 'build/.tmp/electron-builder/build/icon.ico',
    })
  }
}

const getFinalFileName = ({ config, version, product }) => {
  switch (config) {
    case ElectronBuilderConfigType.ArchLinux:
      return `build/.tmp/electron-builder/dist/${product.applicationName}-${version}.${FileExtension.Pacman}`
    case ElectronBuilderConfigType.Deb:
      return `build/.tmp/electron-builder/dist/${product.applicationName}_${version}_amd64.${FileExtension.Deb}`
    case ElectronBuilderConfigType.WindowsExe:
      return `build/.tmp/electron-builder/dist/${product.windowsExecutableName} Setup ${version}.${FileExtension.Exe}`
    case ElectronBuilderConfigType.Snap:
      return `build/.tmp/electron-builder/dist/${product.applicationName}_${version}_amd64.${FileExtension.Snap}`
    case ElectronBuilderConfigType.Mac:
      return `build/.tmp/electron-builder/dist/${product.applicationName}-${version}.${FileExtension.Dmg}`
    case ElectronBuilderConfigType.AppImage:
      return `build/.tmp/electron-builder/dist/${product.applicationName}-${version}.${FileExtension.AppImage}`
    default:
      throw new Error(`cannot get final file name for target ${config}`)
  }
}

const getReleaseFileName = ({ config, product }) => {
  switch (config) {
    case ElectronBuilderConfigType.ArchLinux:
      return `${product.applicationName}.pacman`
    case ElectronBuilderConfigType.Deb:
      return `${product.applicationName}-amd64.deb`
    case ElectronBuilderConfigType.WindowsExe:
      return `${product.windowsExecutableName}.exe`
    case ElectronBuilderConfigType.Snap:
      return `${product.applicationName}.snap`
    case ElectronBuilderConfigType.Mac:
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
    console.log(await readdir(Path.absolute('build/.tmp/electron-builder/dist/')))
  }
}

const addRootPackageJson = async ({ cachePath, version, product, bundleMainProcess }) => {
  const main = bundleMainProcess ? 'packages/main-process/dist/mainProcessMain.js' : 'packages/main-process/src/mainProcessMain.js'
  await JsonFile.writeJson({
    to: `${cachePath}/package.json`,
    value: {
      main,
      name: product.applicationName,
      productName: product.nameLong,
      version: version,
    },
  })
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
  platform,
}) => {
  await bundleElectronMaybe({ product, version, supportsAutoUpdate, shouldRemoveUnusedLocales, isMacos, platform })
  const arch = 'x64'
  const debArch = 'amd64'
  const resourcesPath = isMacos
    ? `build/.tmp/linux/snap/${debArch}/app/${product.applicationName}.app/Contents/Resources`
    : `build/.tmp/linux/snap/${debArch}/app/resources`

  await Copy.copy({
    from: `build/.tmp/electron-bundle/${arch}`,
    to: `build/.tmp/linux/snap/${debArch}/app`,
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
    await Template.write('electron_builder_app_update_yaml', `build/.tmp/linux/snap/${debArch}/app/resources/app-update.yml`, {
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
  if (config === ElectronBuilderConfigType.ArchLinux) {
    await Replace.replace({
      path: `${resourcesPath}/app/packages/main-process/src/parts/Platform/Platform.js`,
      occurrence: `export const isArchLinux = false`,
      replacement: `export const isArchLinux = true`,
    })
    await Replace.replace({
      path: `${resourcesPath}/app/packages/shared-process/src/parts/Platform/Platform.js`,
      occurrence: `export const isArchLinux = false`,
      replacement: `export const isArchLinux = true`,
    })
  }
  if (config === ElectronBuilderConfigType.AppImage) {
    await Replace.replace({
      path: `${resourcesPath}/app/packages/main-process/src/parts/Platform/Platform.js`,
      occurrence: `export const isAppImage = false`,
      replacement: `export const isAppImage = true`,
    })
    await Replace.replace({
      path: `${resourcesPath}/app/packages/shared-process/src/parts/Platform/Platform.js`,
      occurrence: `export const isAppImage = false`,
      replacement: `export const isAppImage = true`,
    })
  }
  if (config === ElectronBuilderConfigType.WindowsExe) {
    await Template.write('windows_cmd', `build/.tmp/linux/snap/${debArch}/app/bin/${product.applicationName}.cmd`, {
      '@@WINDOWS_EXECUTABLE_NAME@@': product.windowsExecutableName,
    })
    await Template.write('windows_cli_bash', `build/.tmp/linux/snap/${debArch}/app/bin/${product.applicationName}`, {
      '@@WINDOWS_EXECUTABLE_NAME@@': product.windowsExecutableName,
    })
    await CreatePlaceholderElectronApp.createPlaceholderElectronApp({ product, version, config, electronVersion })
    await Copy.copyFile({
      from: `build/.tmp/electron-builder-placeholder-app/dist/win-unpacked/${product.windowsExecutableName}.exe`,
      to: `build/.tmp/linux/snap/${debArch}/app/${product.windowsExecutableName}.exe`,
    })
  }
}

const renameReleaseFile = async ({ config, version, product }) => {
  const finalFileName = getFinalFileName({ config, version, product })
  const releaseFileName = getReleaseFileName({ config, product })
  const releaseFilePath = `build/.tmp/releases/${releaseFileName}`
  await Rename.rename({
    from: finalFileName,
    to: releaseFilePath,
  })
  return releaseFilePath
}

export const build = async ({ config, product, shouldRemoveUnusedLocales = false, isMacos = false, platform = process.platform }) => {
  Assert.string(config)
  Assert.object(product)
  // workaround for https://github.com/electron-userland/electron-builder/issues/4594
  // @ts-ignore
  process.env.USE_HARD_LINKS = false
  const version = await Tag.getSemverVersion()
  const electronVersion = await getElectronVersion()
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
    platform,
  })
  console.timeEnd('copyElectronResult')

  console.time('copyElectronBuilderConfig')
  await copyElectronBuilderConfig({ config, version, product, electronVersion, bundleMainProcess })
  console.timeEnd('copyElectronBuilderConfig')

  console.time('copyBuildResources')
  await copyBuildResources({ config })
  console.timeEnd('copyBuildResources')

  console.time('runElectronBuilder')
  await runElectronBuilder({ config })
  console.timeEnd('runElectronBuilder')

  console.time('renameReleaseFile')
  const releaseFilePath = await renameReleaseFile({ config, version, product })
  console.timeEnd('renameReleaseFile')

  await printFinalSize(releaseFilePath)
}
