import VError from 'verror'
import * as Copy from '../Copy/Copy.js'
import * as Exec from '../Exec/Exec.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Product from '../Product/Product.js'
import * as Stat from '../Stat/Stat.js'
import * as Tag from '../Tag/Tag.js'
import * as Template from '../Template/Template.js'
import * as Compress from '../Compress/Compress.js'

const bundleElectronMaybe = async () => {
  const { build } = await import('../BundleElectronApp/BundleElectronApp.js')
  await build()
}

const copyElectronResult = async () => {
  await bundleElectronMaybe()
  await Copy.copy({
    from: `build/.tmp/electron-bundle/x64/resources/app`,
    to: `build/.tmp/arch-linux/x64/usr/lib/${Product.applicationName}`,
  })
}

const copyMetaFiles = async () => {
  const arch = 'x64'
  await Template.write(
    'linux_desktop',
    `build/.tmp/arch-linux/${arch}/usr/share/applications/${Product.applicationName}.desktop`,
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
    `build/.tmp/arch-linux/${arch}/usr/share/bash-completion/completions/${Product.applicationName}`,
    {
      '@@APPNAME@@': Product.applicationName,
    }
  )
  const version = await Tag.getSemverVersion()
  await Template.write(
    'arch_linux_pkginfo',
    `build/.tmp/arch-linux/${arch}/.PKGINFO`,
    {
      '@@APPNAME@@': Product.applicationName,
      '@@VERSION@@': version,
      '@@PACKAGER@@': Product.linuxMaintainer,
      '@@LICENSE@@': Product.licenseName,
      '@@SIZE@@': '1000',
      '@@BUILD_DATE@@': '1000',
    }
  )
  await Template.write(
    'arch_linux_bin',
    `build/.tmp/arch-linux/${arch}/usr/bin/${Product.applicationName}`,
    {
      '@@APPNAME@@': Product.applicationName,
    },
    755
  )
  await Copy.copyFile({
    from: 'build/files/icon.png',
    to: `build/.tmp/arch-linux/${arch}/usr/share/pixmaps/${Product.applicationName}.png`,
  })

  // TODO
  // const installedSize = await getInstalledSize(
  //   Path.absolute(`build/.tmp/linux/arch/${arch}/app`)
  // )
  // const tag = await Tag.getGitTag()
}

const printTarZstSize = async () => {
  try {
    const debArch = 'amd64'
    const size = await Stat.getFileSize(
      Path.absolute(
        `build/.tmp/releases/${Product.applicationName}-${debArch}.deb`
      )
    )
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

const createMTree = async () => {
  await Compress.createMTree(Path.absolute(`build/.tmp/arch-linux/x64`), 'usr')
}

export const build = async () => {
  if (!isFakeRoot()) {
    Logger.info('[info] enabling fakeroot')
    await Exec.exec('fakeroot', process.argv, { stdio: 'inherit' })
    return
  }
  console.time('copyElectronResult')
  await copyElectronResult()
  console.timeEnd('copyElectronResult')

  console.time('copyMetaFiles')
  await copyMetaFiles()
  console.timeEnd('copyMetaFiles')

  console.time('createMTree')
  await createMTree()
  console.timeEnd('createMTree')

  await printTarZstSize()
}
