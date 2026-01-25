import { chmod, writeFile } from 'node:fs/promises'
import { VError } from '@lvce-editor/verror'
import * as ArchType from '../ArchType/ArchType.js'
import * as Compress from '../Compress/Compress.js'
import * as Copy from '../Copy/Copy.js'
import * as Exec from '../Exec/Exec.js'
import * as GetDebPackageArch from '../GetDebPackageArch/GetDebPackageArch.js'
import * as GetInstalledSize from '../GetInstalledSize/GetInstalledSize.js'
import * as IsFakeRoot from '../IsFakeRoot/IsFakeRoot.js'
import * as LinuxDependencies from '../LinuxDependencies/LinuxDependencies.js'
import * as Logger from '../Logger/Logger.js'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Path from '../Path/Path.js'
import * as Process from '../Process/Process.js'
import * as Remove from '../Remove/Remove.js'
import * as Rename from '../Rename/Rename.js'
import * as Replace from '../Replace/Replace.js'
import * as Stat from '../Stat/Stat.js'
import * as Symlink from '../Symlink/Symlink.js'
import * as Template from '../Template/Template.js'
import * as Version from '../Version/Version.js'

const bundleElectronMaybe = async ({ product, version, shouldRemoveUnusedLocales, arch = ArchType.Amd64, platform, target }) => {
  // if (existsSync(Path.absolute(`packages/build/.tmp/electron-bundle`))) {
  //   console.info('[electron build skipped]')
  //   return
  // }
  const { build } = await import('../BundleElectronApp/BundleElectronApp.js')
  // @ts-ignore
  await build({ product, version, shouldRemoveUnusedLocales, arch, platform, target })
}

const copyElectronResult = async ({ product, version, arch, debArch, platform, target }) => {
  await bundleElectronMaybe({ product, version, shouldRemoveUnusedLocales: true, arch, platform, target })
  await Copy.copy({
    from: `packages/build/.tmp/electron-bundle/${arch}`,
    to: `packages/build/.tmp/linux/deb/${debArch}/app/usr/lib/${product.applicationName}`,
  })
  await Remove.remove(
    `packages/build/.tmp/linux/deb/${debArch}/app/usr/lib/${product.applicationName}/resources/app/packages/shared-process/node_modules/@lvce-editor/ripgrep`,
  )
  await Replace.replace({
    path: `packages/build/.tmp/linux/deb/${debArch}/app/usr/lib/${product.applicationName}/resources/app/packages/shared-process/node_modules/@lvce-editor/search-process/dist/index.js`,
    occurrence: `import { rgPath } from '@lvce-editor/ripgrep'`,
    replacement: ``,
  })
  await Replace.replace({
    path: `packages/build/.tmp/linux/deb/${debArch}/app/usr/lib/${product.applicationName}/resources/app/packages/shared-process/node_modules/@lvce-editor/search-process/dist/index.js`,
    occurrence: `const ripGrepPath = getRipGrepPath() || rgPath`,
    replacement: `const ripGrepPath = 'rg'`,
  })
}

const copyMetaFiles = async ({ product, version, debArch }) => {
  await Template.write('linux_desktop', `packages/build/.tmp/linux/deb/${debArch}/app/usr/share/applications/${product.applicationName}.desktop`, {
    '@@NAME_LONG@@': product.nameLong,
    '@@NAME_SHORT@@': product.nameShort,
    '@@NAME@@': product.applicationName,
    '@@EXEC@@': `${product.applicationName} %U`,
    '@@ICON@@': product.applicationName,
    '@@URL_PROTOCOL@@': product.applicationName,
    '@@SUMMARY@@': product.linuxSummary,
    '@@KEYWORDS@@': `${product.applicationName};`,
    '@@APPLICATION_NAME@@': product.applicationName,
  })
  await Template.write(
    'bash_completion',
    `packages/build/.tmp/linux/deb/${debArch}/app/usr/share/bash-completion/completions/${product.applicationName}`,
    {
      '@@APPNAME@@': product.applicationName,
    },
  )
  await Template.write('lintian_overrides', `packages/build/.tmp/linux/deb/${debArch}/app/usr/share/lintian/overrides/${product.applicationName}`, {
    '@@NAME@@': product.applicationName,
  })
  await Copy.copyFile({
    from: 'packages/build/files/icon.png',
    to: `packages/build/.tmp/linux/deb/${debArch}/app/usr/share/pixmaps/${product.applicationName}.png`,
  })

  const installedSize = await GetInstalledSize.getInstalledSize(Path.absolute(`packages/build/.tmp/linux/deb/${debArch}/app`))
  const defaultDepends = LinuxDependencies.defaultDepends
  // TODO add options to process.argv whether or not ripgrep should be bundled or a dependency
  const recommends = LinuxDependencies.recommends
  const depends = [...defaultDepends].join(', ')
  await Template.write('debian_control', `packages/build/.tmp/linux/deb/${debArch}/DEBIAN/control`, {
    '@@NAME@@': product.applicationName,
    '@@VERSION@@': version,
    '@@ARCHITECTURE@@': debArch,
    '@@INSTALLED_SIZE@@': `${installedSize}`,
    '@@HOMEPAGE@@': product.homePage,
    '@@MAINTAINER@@': product.linuxMaintainer,
    '@@DEPENDS@@': depends,
    '@@RECOMMENDS@@': recommends,
  })

  // TODO include electron/chromium licenses here? They are already at <appName>/Licenses.chromium.html
  // TODO include licenses of all used npm modules here?
  await Template.write('linux_copyright', `packages/build/.tmp/linux/deb/${debArch}/app/usr/share/doc/${product.applicationName}/copyright`, {
    '@@COPYRIGHT@@': product.copyrightShort,
    '@@LICENSE@@': product.licenseName,
  })
  await Remove.remove(`packages/build/.tmp/linux/deb/${debArch}/app/usr/bin`)
  await Mkdir.mkdir(`packages/build/.tmp/linux/deb/${debArch}/app/usr/bin`)
  await Symlink.symlink(
    `../lib/${product.applicationName}/${product.applicationName}`,
    Path.absolute(`packages/build/.tmp/linux/deb/${debArch}/app/usr/bin/${product.applicationName}`),
  )
}

const compressData = async ({ debArch }) => {
  const cwd = Path.absolute(`packages/build/.tmp/linux/deb/${debArch}/app`)
  try {
    console.time('compressing data')
    await Compress.tarXz('.', '../data.tar.xz', {
      cwd,
    })
    console.timeEnd('compressing data')
  } catch (error) {
    throw new VError(error, 'Failed to create deb')
  }
}

const compressControl = async ({ debArch }) => {
  const cwd = Path.absolute(`packages/build/.tmp/linux/deb/${debArch}/DEBIAN`)
  try {
    await Compress.tarXz('.', '../control.tar.xz', {
      cwd,
    })
  } catch (error) {
    throw new VError(error, 'Failed to create deb')
  }
}

const createDebianBinaryFile = async ({ debArch }) => {
  const cwd = Path.absolute(`packages/build/.tmp/linux/deb/${debArch}`)
  await writeFile(Path.join(cwd, 'debian-binary'), '2.0\n')
}

const createDeb = async ({ product, debArch }) => {
  try {
    const cwd = Path.absolute(`packages/build/.tmp/linux/deb/${debArch}`)
    const releases = Path.absolute(`packages/build/.tmp/releases`)
    await Mkdir.mkdir(releases)
    const appName = product.applicationName
    await Compress.deb('control.tar.xz', 'data.tar.xz', {
      cwd,
    })
    await Rename.rename({
      from: Path.join(cwd, 'app.deb'),
      to: Path.join(releases, `${appName}-${debArch}.deb`),
    })
  } catch (error) {
    throw new VError(error, 'Failed to create deb')
  }
}

const printDebSize = async ({ product, debArch }) => {
  try {
    const size = await Stat.getFileSize(Path.absolute(`packages/build/.tmp/releases/${product.applicationName}-${debArch}.deb`))
    Logger.info(`deb size: ${size}`)
  } catch (error) {
    throw new VError(error, `Failed to print deb size`)
  }
}

const fixPermissions = async ({ debArch, product }) => {
  try {
    const folder = Path.absolute(`packages/build/.tmp/linux/deb/${debArch}/app`)
    // change permissions from 775 to 755
    await Exec.exec('find', [folder, '-type', 'd', '-perm', '775', '-print', '-exec', 'chmod', '755', '{}', '+'], {
      stdout: 'ignore',
      stderr: 'inherit',
    })
    // change permissions from 664 to 644
    await Exec.exec('find', [folder, '-type', 'f', '-perm', '664', '-print', '-exec', 'chmod', '644', '{}', '+'], {
      stdout: 'ignore',
      stderr: 'inherit',
    })
    await chmod(Path.absolute(`packages/build/.tmp/linux/deb/${debArch}/app/usr/lib/${product.applicationName}/chrome-sandbox`), 0o4755)
  } catch (error) {
    throw new VError(error, 'Failed to fix permissions')
  }
}

const cleanup = async ({ debArch }) => {
  const cwd = Path.absolute(`packages/build/.tmp/linux/deb/${debArch}`)
  await Remove.remove(cwd)
}

export const build = async ({ product, arch, target }) => {
  const platform = 'linux'
  if (arch === ArchType.ArmHf) {
    arch = ArchType.Armv7l
  }
  const debArch = GetDebPackageArch.getDebPackageArch(arch)
  if (!IsFakeRoot.isFakeRoot()) {
    Logger.info('[info] enabling fakeroot')
    await Exec.exec('fakeroot', Process.argv, { stdio: 'inherit' })
    return
  }
  const version = await Version.getVersion()

  console.time('cleanup')
  await cleanup({ debArch })
  console.timeEnd('cleanup')

  console.time('copyElectronResult')
  await copyElectronResult({ product, version, arch, debArch, platform, target })
  console.timeEnd('copyElectronResult')

  console.time('copyMetaFiles')
  await copyMetaFiles({ product, version, debArch })
  console.timeEnd('copyMetaFiles')

  console.time('fixPermissions')
  await fixPermissions({ product, debArch })
  console.timeEnd('fixPermissions')

  console.time('compressData')
  await compressData({ debArch })
  console.timeEnd('compressData')

  console.time('compressControl')
  await compressControl({ debArch })
  console.timeEnd('compressControl')

  console.time('createDebianBinaryFile')
  await createDebianBinaryFile({ debArch })
  console.timeEnd('createDebianBinaryFile')

  console.time('createDeb')
  await createDeb({ product, debArch })
  console.timeEnd('createDeb')

  await printDebSize({ product, debArch })
}
