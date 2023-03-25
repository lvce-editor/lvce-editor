import { chmod, symlink, writeFile } from 'node:fs/promises'
import VError from 'verror'
import * as ArchType from '../ArchType/ArchType.js'
import * as Compress from '../Compress/Compress.js'
import * as Copy from '../Copy/Copy.js'
import * as Exec from '../Exec/Exec.js'
import * as GetInstalledSize from '../GetInstalledSize/GetInstalledSize.js'
import * as Logger from '../Logger/Logger.js'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Path from '../Path/Path.js'
import * as Process from '../Process/Process.js'
import * as Remove from '../Remove/Remove.js'
import * as Rename from '../Rename/Rename.js'
import * as Replace from '../Replace/Replace.js'
import * as Stat from '../Stat/Stat.js'
import * as Tag from '../Tag/Tag.js'
import * as Template from '../Template/Template.js'

const getDebPackageArch = (arch) => {
  switch (arch) {
    case ArchType.X64:
      return 'amd64'
    case 'armhf':
      return 'armhf'
    case 'arm64':
      return 'arm64'
    default:
      throw new Error(`unsupported arch "${arch}"`)
  }
}

const bundleElectronMaybe = async ({ product, version }) => {
  // if (existsSync(Path.absolute(`build/.tmp/electron-bundle`))) {
  //   console.info('[electron build skipped]')
  //   return
  // }
  const { build } = await import('../BundleElectronApp/BundleElectronApp.js')
  await build({ product, version })
}

const copyElectronResult = async ({ product, version }) => {
  await bundleElectronMaybe({ product, version })
  const debArch = 'amd64'
  await Copy.copy({
    from: `build/.tmp/electron-bundle/x64`,
    to: `build/.tmp/linux/deb/${debArch}/app/usr/lib/${product.applicationName}`,
  })
  await Remove.remove(
    `build/.tmp/linux/deb/${debArch}/app/usr/lib/${product.applicationName}/resources/app/packages/shared-process/node_modules/vscode-ripgrep-with-github-api-error-fix`
  )
  await Replace.replace({
    path: `build/.tmp/linux/deb/${debArch}/app/usr/lib/${product.applicationName}/resources/app/packages/shared-process/src/parts/RipGrepPath/RipGrepPath.js`,
    occurrence: `export { rgPath } from 'vscode-ripgrep-with-github-api-error-fix'`,
    replacement: `export const rgPath = 'rg'`,
  })
}

const copyMetaFiles = async ({ product }) => {
  const debArch = 'amd64'

  await Template.write('linux_desktop', `build/.tmp/linux/deb/${debArch}/app/usr/share/applications/${product.applicationName}.desktop`, {
    '@@NAME_LONG@@': product.nameLong,
    '@@NAME_SHORT@@': product.nameShort,
    '@@NAME@@': product.applicationName,
    '@@EXEC@@': `${product.applicationName} %U`,
    '@@ICON@@': product.applicationName,
    '@@URL_PROTOCOL@@': product.applicationName,
    '@@SUMMARY@@': product.linuxSummary,
    '@@KEYWORDS@@': `${product.applicationName};`,
  })
  await Template.write('bash_completion', `build/.tmp/linux/deb/${debArch}/app/usr/share/bash-completion/completions/${product.applicationName}`, {
    '@@APPNAME@@': product.applicationName,
  })
  await Template.write('lintian_overrides', `build/.tmp/linux/deb/${debArch}/app/usr/share/lintian/overrides/${product.applicationName}`, {})
  await Copy.copyFile({
    from: 'build/files/icon.png',
    to: `build/.tmp/linux/deb/${debArch}/app/usr/share/pixmaps/${product.applicationName}.png`,
  })

  const installedSize = await GetInstalledSize.getInstalledSize(Path.absolute(`build/.tmp/linux/deb/${debArch}/app`))
  const tag = await Tag.getGitTag()
  const defaultDepends = ['libnss3 (>= 2:3.26)', 'gnupg', 'apt', 'libxkbfile1', 'libsecret-1-0', 'libgtk-3-0 (>= 3.10.0)', 'libxss1', 'libgbm1']
  // TODO add options to process.argv whether or not ripgrep should be bundled or a dependency
  const additionalDepends = ['ripgrep']
  const depends = [...defaultDepends, ...additionalDepends].join(', ')
  await Template.write('debian_control', `build/.tmp/linux/deb/${debArch}/DEBIAN/control`, {
    '@@NAME@@': product.applicationName,
    '@@VERSION@@': tag,
    '@@ARCHITECTURE@@': debArch,
    '@@INSTALLED_SIZE@@': `${installedSize}`,
    '@@HOMEPAGE@@': product.homePage,
    '@@MAINTAINER@@': product.linuxMaintainer,
    '@@DEPENDS@@': depends,
  })

  // TODO include electron/chromium licenses here? They are already at <appName>/Licenses.chromium.html
  // TODO include licenses of all used npm modules here?
  await Template.write('linux_copyright', `build/.tmp/linux/deb/${debArch}/app/usr/share/doc/${product.applicationName}/copyright`, {
    '@@COPYRIGHT@@': product.copyrightShort,
    '@@LICENSE@@': product.licenseName,
  })
  await Mkdir.mkdir(`build/.tmp/linux/deb/${debArch}/app/usr/bin`)
  await Remove.remove(`build/.tmp/linux/deb/amd64/app/usr/bin/lvce-oss`)
  await symlink(`../lib/lvce-oss/lvce-oss`, Path.absolute(`build/.tmp/linux/deb/amd64/app/usr/bin/lvce-oss`))
}

const compressData = async () => {
  const debArch = 'amd64'
  const cwd = Path.absolute(`build/.tmp/linux/deb/${debArch}/app`)
  try {
    console.time('compressing data')
    await Compress.tarXz('.', '../data.tar.xz', {
      cwd,
    })
    console.timeEnd('compressing data')
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to create deb')
  }
}

const compressControl = async () => {
  const debArch = 'amd64'
  const cwd = Path.absolute(`build/.tmp/linux/deb/${debArch}/DEBIAN`)
  try {
    await Compress.tarXz('.', '../control.tar.xz', {
      cwd,
    })
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to create deb')
  }
}

const createDebianBinaryFile = async () => {
  const debArch = 'amd64'
  const cwd = Path.absolute(`build/.tmp/linux/deb/${debArch}`)
  await writeFile(Path.join(cwd, 'debian-binary'), '2.0\n')
}

const createDeb = async ({ product }) => {
  try {
    const debArch = 'amd64'
    const cwd = Path.absolute(`build/.tmp/linux/deb/${debArch}`)
    const releases = Path.absolute(`build/.tmp/releases`)
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
    // @ts-ignore
    throw new VError(error, 'Failed to create deb')
  }
}

const printDebSize = async ({ product }) => {
  try {
    const debArch = 'amd64'
    const size = await Stat.getFileSize(Path.absolute(`build/.tmp/releases/${product.applicationName}-${debArch}.deb`))
    Logger.info(`deb size: ${size}`)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to print deb size`)
  }
}

const isFakeRoot = () => {
  // https://stackoverflow.com/questions/33446353/bash-check-if-user-is-root
  const ldLibraryPath = process.env.LD_LIBRARY_PATH
  return ldLibraryPath && ldLibraryPath.includes('libfakeroot')
}

const fixPermissions = async () => {
  try {
    const debArch = 'amd64'
    const folder = Path.absolute(`build/.tmp/linux/deb/${debArch}/app`)
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
    const extraFiles = [
      // `build/.tmp/linux/deb/${debArch}/app/usr/lib/${product.applicationName}/resources/app/packages/web/bin/web.js`,
      // `build/.tmp/linux/deb/${debArch}/app/usr/lib/${product.applicationName}/resources/app/packages/pty-host/node_modules/node-pty/build/Release/pty.node`,
      // `build/.tmp/linux/deb/${debArch}/app/usr/lib/${product.applicationName}/resources/app/packages/pty-host/node_modules/node-pty/build/Release/obj.target/pty.node`,
      // `build/.tmp/linux/deb/${debArch}/app/usr/lib/${product.applicationName}/resources/app/packages/pty-host/node_modules/node-pty/bin/linux-x64-106/node-pty.node`,
    ]
    for (const extraFile of extraFiles) {
      await chmod(Path.absolute(extraFile), 0o755)
    }
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to fix permissions')
  }
}

export const build = async ({ product }) => {
  if (!isFakeRoot()) {
    Logger.info('[info] enabling fakeroot')
    await Exec.exec('fakeroot', Process.argv, { stdio: 'inherit' })
    return
  }
  const version = await Tag.getGitTag()

  console.time('copyElectronResult')
  await copyElectronResult({ product, version })
  console.timeEnd('copyElectronResult')

  console.time('copyMetaFiles')
  await copyMetaFiles({ product })
  console.timeEnd('copyMetaFiles')

  console.time('fixPermissions')
  await fixPermissions()
  console.timeEnd('fixPermissions')

  console.time('compressData')
  await compressData()
  console.timeEnd('compressData')

  console.time('compressControl')
  await compressControl()
  console.timeEnd('compressControl')

  console.time('createDebianBinaryFile')
  await createDebianBinaryFile()
  console.timeEnd('createDebianBinaryFile')

  console.time('createDeb')
  await createDeb({ product })
  console.timeEnd('createDeb')

  await printDebSize({ product })
}
