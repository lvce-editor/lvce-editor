import { VError } from '@lvce-editor/verror'
import * as ElectronBuilder from 'electron-builder'
import { readdir } from 'node:fs/promises'
import * as AddRootPackageJson from '../AddRootPackageJson/AddRootPackageJson.ts'
import * as Assert from '../Assert/Assert.ts'
import * as BundleOptions from '../BundleOptions/BundleOptions.ts'
import * as Copy from '../Copy/Copy.ts'
import * as CreatePlaceholderElectronApp from '../CreatePlaceholderElectronApp/CreatePlaceholderElectronApp.ts'
import * as ElectronBuilderConfigType from '../ElectronBuilderConfigType/ElectronBuilderConfigType.ts'
import * as FileExtension from '../FileExtension/FileExtension.ts'
import * as GetElectronVersion from '../GetElectronVersion/GetElectronVersion.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Rename from '../Rename/Rename.ts'
import * as Replace from '../Replace/Replace.ts'
import * as ResolveBuiltArtifactPath from '../ResolveBuiltArtifactPath/ResolveBuiltArtifactPath.ts'
import * as Stat from '../Stat/Stat.ts'
import * as Tag from '../Tag/Tag.ts'
import * as Template from '../Template/Template.ts'

// TODO don't need to include whole node-pty module
// TODO maybe don't need to include nan module
// TODO don't need to include whole @lvce-editor/ripgrep module (only path)

const bundleElectronMaybe = async ({
  product,
  version,
  config,
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
  const { build } = await import('../BundleElectronApp/BundleElectronApp.ts')
  const target = getBundleTarget(config)
  await build({ product, version, supportsAutoUpdate, shouldRemoveUnusedLocales, isMacos, arch, platform, isArchLinux, isAppImage, target })
}

const getBundleTarget = (config) => {
  switch (config) {
    case ElectronBuilderConfigType.WindowsExe:
      return 'electron-builder-windows-exe'
    case ElectronBuilderConfigType.Deb:
      return 'electron-builder-deb'
    case ElectronBuilderConfigType.ArchLinux:
      return 'electron-builder-arch-linux'
    case ElectronBuilderConfigType.Snap:
      return 'electron-builder-snap'
    case ElectronBuilderConfigType.Mac:
      return 'electron-builder-mac'
    case ElectronBuilderConfigType.AppImage:
      return 'electron-builder-app-image'
    default:
      return 'electron-builder'
  }
}

const copyElectronBuilderConfig = async ({ config, version, product, electronVersion, bundleMainProcess, asar }) => {
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
    '@@MAC_BUNDLE_ID@@': product.macBundleId,
    '@@MAIN@@': mainProcessPath,
    '@@ASAR@@': String(asar),
  })
}

const getElectronBuilderArch = (arch) => {
  switch (arch) {
    case 'x64':
      return ElectronBuilder.Arch.x64
    case 'armv7l':
      return ElectronBuilder.Arch.armv7l
    case 'arm64':
      return ElectronBuilder.Arch.arm64
    default:
      throw new Error(`unsupported electron-builder arch "${arch}"`)
  }
}

const getPrepackagedPath = ({ config, product }) => {
  const debArch = 'amd64'
  const appPath = `packages/build/.tmp/linux/snap/${debArch}/app`
  if (config === ElectronBuilderConfigType.Mac) {
    return Path.absolute(`${appPath}/${product.applicationName}.app`)
  }
  return Path.absolute(appPath)
}

const getElectronBuilderTargets = ({ config, arch }) => {
  const electronBuilderArch = getElectronBuilderArch(arch)
  switch (config) {
    case ElectronBuilderConfigType.ArchLinux:
      return ElectronBuilder.Platform.LINUX.createTarget('pacman', electronBuilderArch)
    case ElectronBuilderConfigType.Deb:
      return ElectronBuilder.Platform.LINUX.createTarget('deb', electronBuilderArch)
    case ElectronBuilderConfigType.Snap:
      return ElectronBuilder.Platform.LINUX.createTarget('snap', electronBuilderArch)
    case ElectronBuilderConfigType.AppImage:
      return ElectronBuilder.Platform.LINUX.createTarget('appImage', electronBuilderArch)
    case ElectronBuilderConfigType.Mac:
      return ElectronBuilder.Platform.MAC.createTarget('dmg', electronBuilderArch)
    case ElectronBuilderConfigType.WindowsExe:
      return ElectronBuilder.Platform.WINDOWS.createTarget('nsis', electronBuilderArch)
    default:
      throw new Error(`cannot get electron-builder target for config "${config}"`)
  }
}

const runElectronBuilder = async ({ config, product, arch }) => {
  try {
    const options: ElectronBuilder.CliOptions = {
      projectDir: Path.absolute('packages/build/.tmp/electron-builder'),
      prepackaged: getPrepackagedPath({ config, product }),
      publish: 'never',
      targets: getElectronBuilderTargets({ config, arch }),

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
  if (config === ElectronBuilderConfigType.Mac) {
    await Copy.copyFile({
      from: `packages/build/files/icon.icns`,
      to: 'packages/build/.tmp/electron-builder/build/icon.icns',
    })
    await Copy.copyFile({
      from: `packages/build/files/mac/entitlements.mac.plist`,
      to: 'packages/build/.tmp/electron-builder/build/entitlements.mac.plist',
    })
    await Copy.copyFile({
      from: `packages/build/files/mac/entitlements.mac.inherit.plist`,
      to: 'packages/build/.tmp/electron-builder/build/entitlements.mac.inherit.plist',
    })
  }
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
  asar = false,
  isMacos,
  arch = 'x64',
  platform,
  isArchLinux,
  isAppImage,
}) => {
  await bundleElectronMaybe({
    product,
    version,
    config,
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
    await CreatePlaceholderElectronApp.createPlaceholderElectronApp({ product, version, config, electronVersion, asar })
    await Copy.copyFile({
      from: `packages/build/.tmp/electron-builder-placeholder-app/dist/win-unpacked/${product.windowsExecutableName}.exe`,
      to: `packages/build/.tmp/linux/snap/${debArch}/app/${product.windowsExecutableName}.exe`,
    })
  }
}

const renameReleaseFile = async ({ config, product, arch, finalFileName }) => {
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
  asar = false,
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
    asar,
    isMacos,
    arch,
    platform,
    isArchLinux,
    isAppImage,
  })
  console.timeEnd('copyElectronResult')

  console.time('copyElectronBuilderConfig')
  await copyElectronBuilderConfig({ config, version, product, electronVersion, bundleMainProcess, asar })
  console.timeEnd('copyElectronBuilderConfig')

  console.time('copyBuildResources')
  await copyBuildResources({ config })
  console.timeEnd('copyBuildResources')

  console.time('runElectronBuilder')
  await runElectronBuilder({ config, product, arch })
  console.timeEnd('runElectronBuilder')

  const distPath = 'packages/build/.tmp/electron-builder/dist'
  const distEntries = await readdir(Path.absolute(distPath))
  const expectedFinalFileName = getFinalFileName({ config, version, product, arch })
  const finalFileName = ResolveBuiltArtifactPath.resolveBuiltArtifactPath({
    config,
    version,
    expectedPath: expectedFinalFileName,
    distEntries,
    distPath,
  })

  console.time('renameReleaseFile')
  const releaseFilePath = await renameReleaseFile({ config, product, arch, finalFileName })
  console.timeEnd('renameReleaseFile')

  await printFinalSize(releaseFilePath)
}
