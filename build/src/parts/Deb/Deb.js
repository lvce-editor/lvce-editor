import { existsSync } from 'fs'
import { chmod, link, mkdir, rename, rm, symlink, writeFile } from 'fs/promises'
import VError from 'verror'
import * as Compress from '../Compress/Compress.js'
import * as Copy from '../Copy/Copy.js'
import * as Exec from '../Exec/Exec.js'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Path from '../Path/Path.js'
import * as Product from '../Product/Product.js'
import { readFile } from '../ReadFile/ReadFile.js'
import * as Stat from '../Stat/Stat.js'
import * as Template from '../Template/Template.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const getDebPackageArch = (arch) => {
  switch (arch) {
    case 'x64':
      return 'amd64'
    case 'armhf':
      return 'armhf'
    case 'arm64':
      return 'arm64'
    default:
      throw new Error(`unsupported arch "${arch}"`)
  }
}

const bundleElectronMaybe = async () => {
  if (existsSync(Path.absolute(`build/.tmp/electron-bundle`))) {
    console.info('[electron build skipped]')
    return
  }
  const { build } = await import('../BundleElectronApp/BundleElectronApp.js')
  await build()
}

const copyElectronResult = async () => {
  await bundleElectronMaybe()
  const debArch = 'amd64'
  await Copy.copy({
    from: `build/.tmp/electron-bundle/x64`,
    to: `build/.tmp/linux/deb/${debArch}/app/usr/lib/${Product.applicationName}`,
  })
}

// see https://stackoverflow.com/questions/19029008/how-to-create-a-simply-debian-package-just-compress-extract-sources-or-any-file
const getInstalledSize = async (cwd) => {
  const { stdout } = await Exec.exec(`du -ks usr|cut -f 1`, {
    cwd,
    shell: true,
  })
  const installedSize = parseInt(stdout)
  return installedSize
}

const copyMetaFiles = async () => {
  const debArch = 'amd64'
  await Template.write(
    'linux_desktop',
    `build/.tmp/linux/deb/${debArch}/app/usr/share/applications/${Product.applicationName}.desktop`,
    {
      '@@NAME_LONG@@': Product.nameLong,
      '@@NAME_SHORT@@': Product.nameShort,
      '@@NAME@@': Product.applicationName,
      '@@EXEC@@': `${Product.applicationName} %U`,
      '@@ICON@@': Product.applicationName,
      '@@URL_PROTOCOL@@': Product.applicationName,
      '@@SUMMARY@@': Product.linuxSummary,
      '@@KEYWORDS@@': `${Product.applicationName};`,
    }
  )
  await Template.write(
    'bash_completion',
    `build/.tmp/linux/deb/${debArch}/app/usr/share/bash-completion/completions/${Product.applicationName}`,
    {
      '@@APPNAME@@': Product.applicationName,
    }
  )
  await Template.write(
    'lintian_overrides',
    `build/.tmp/linux/deb/${debArch}/app/usr/share/lintian/overrides/${Product.applicationName}`,
    {}
  )
  await Copy.copyFile({
    from: 'build/files/icon.png',
    to: `build/.tmp/linux/deb/${debArch}/app/usr/share/pixmaps/${Product.applicationName}.png`,
  })

  const installedSize = await getInstalledSize(
    Path.absolute(`build/.tmp/linux/deb/${debArch}/app`)
  )
  await Template.write(
    'debian_control',
    `build/.tmp/linux/deb/${debArch}/DEBIAN/control`,
    {
      '@@NAME@@': Product.applicationName,
      '@@VERSION@@': Product.version,
      '@@ARCHITECTURE@@': debArch,
      '@@INSTALLED_SIZE@@': `${installedSize}`,
      '@@HOMEPAGE@@': Product.homePage,
      '@@MAINTAINER@@': Product.linuxMaintainer,
    }
  )
  await Template.write(
    'debian_postinst',
    `build/.tmp/linux/deb/${debArch}/DEBIAN/postinst`,
    {
      '@@NAME@@': Product.applicationName,
    },
    755
  )
  await Template.write(
    'debian_postrm',
    `build/.tmp/linux/deb/${debArch}/DEBIAN/postrm`,
    {
      '@@NAME@@': Product.applicationName,
    },
    755
  )
  // await Template.write(
  //   'debian_prerm',
  //   `build/.tmp/linux/deb/${debArch}/DEBIAN/prerm`,
  //   {
  //     '@@NAME@@': Product.applicationName,
  //   },
  //   755
  // )

  // TODO include electron/chromium licenses here? They are already at <appName>/Licenses.chromium.html
  // TODO include licenses of all used npm modules here?
  await Template.write(
    'linux_copyright',
    `build/.tmp/linux/deb/${debArch}/app/usr/share/doc/${Product.applicationName}/copyright`,
    {
      '@@COPYRIGHT@@': Product.copyrightShort,
      '@@LICENSE@@': Product.licenseName,
    }
  )
  // await mkdir(Path.absolute(`build/.tmp/linux/deb/${debArch}/app/usr/bin`), {
  //   recursive: true,
  // })
  // await rm(Path.absolute(`build/.tmp/linux/deb/amd64/app/usr/bin/lvce-oss`), {
  //   force: true,
  // })
  // await symlink(
  //   `../../usr/lib/lvce-oss/lvce-oss`,
  //   Path.absolute(`build/.tmp/linux/deb/amd64/app/usr/bin/lvce-oss`)
  // )
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

const createDeb = async () => {
  const debArch = 'amd64'
  const cwd = Path.absolute(`build/.tmp/linux/deb/${debArch}`)
  await Mkdir.mkdir(`build/.tmp/linux/deb/${debArch}/deb`)
  try {
    await Compress.deb('control.tar.xz', 'data.tar.xz', {
      cwd,
    })
    await rename(Path.join(cwd, 'app.deb'), Path.join(cwd, 'deb', 'app.deb'))
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to create deb')
  }
}

const printDebSize = async () => {
  const debArch = 'amd64'
  const size = await Stat.getFileSize(
    `build/.tmp/linux/deb/${debArch}/deb/app.deb`
  )
  console.info(`deb size: ${size}`)
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
    await Exec.exec(
      'find',
      [
        folder,
        '-type',
        'd',
        '-perm',
        '775',
        '-print',
        '-exec',
        'chmod',
        '755',
        '{}',
        '+',
      ],
      { stdout: 'ignore', stderr: 'inherit' }
    )
    // change permissions from 664 to 644
    await Exec.exec(
      'find',
      [
        folder,
        '-type',
        'f',
        '-perm',
        '664',
        '-print',
        '-exec',
        'chmod',
        '644',
        '{}',
        '+',
      ],
      { stdout: 'ignore', stderr: 'inherit' }
    )
    const extraFiles = [
      // `build/.tmp/linux/deb/${debArch}/app/usr/lib/${Product.applicationName}/resources/app/packages/web/bin/web.js`,
      // `build/.tmp/linux/deb/${debArch}/app/usr/lib/${Product.applicationName}/resources/app/packages/pty-host/node_modules/node-pty/build/Release/pty.node`,
      // `build/.tmp/linux/deb/${debArch}/app/usr/lib/${Product.applicationName}/resources/app/packages/pty-host/node_modules/node-pty/build/Release/obj.target/pty.node`,
      // `build/.tmp/linux/deb/${debArch}/app/usr/lib/${Product.applicationName}/resources/app/packages/pty-host/node_modules/node-pty/bin/linux-x64-106/node-pty.node`,
    ]
    for (const extraFile of extraFiles) {
      await chmod(Path.absolute(extraFile), 0o755)
    }
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to fix permissions')
  }
}

export const build = async () => {
  if (!isFakeRoot()) {
    console.info('[info] enabling fakeroot')
    await Exec.exec('fakeroot', process.argv, { stdio: 'inherit' })
    return
  }
  console.time('copyElectronResult')
  await copyElectronResult()
  console.timeEnd('copyElectronResult')

  console.time('copyMetaFiles')
  await copyMetaFiles()
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
  await createDeb()
  console.timeEnd('createDeb')

  await printDebSize()
}
