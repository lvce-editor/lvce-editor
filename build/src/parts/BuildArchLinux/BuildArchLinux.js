import VError from 'verror'
import * as ArchType from '../ArchType/ArchType.js'
import * as Compress from '../Compress/Compress.js'
import * as Copy from '../Copy/Copy.js'
import * as Exec from '../Exec/Exec.js'
import * as Logger from '../Logger/Logger.js'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Path from '../Path/Path.js'
import * as Process from '../Process/Process.js'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as Remove from '../Remove/Remove.js'
import * as Replace from '../Replace/Replace.js'
import * as Stat from '../Stat/Stat.js'
import * as Tag from '../Tag/Tag.js'
import * as Template from '../Template/Template.js'

const bundleElectronMaybe = async ({ product }) => {
  const { build } = await import('../BundleElectronApp/BundleElectronApp.js')
  await build({ product })
}

const copyElectronResult = async ({ product }) => {
  await bundleElectronMaybe({ product })
  await Copy.copy({
    from: `build/.tmp/electron-bundle/x64/resources/app`,
    to: `build/.tmp/arch-linux/x64/usr/lib/${product.applicationName}`,
  })
  await Remove.remove(`build/.tmp/arch-linux/x64/usr/lib/${product.applicationName}/packages/shared-process/node_modules/keytar`)
  await Remove.remove(
    `build/.tmp/arch-linux/x64/usr/lib/${product.applicationName}/packages/shared-process/node_modules/vscode-ripgrep-with-github-api-error-fix`
  )
  await Remove.remove(
    `build/.tmp/arch-linux/x64/usr/lib/${product.applicationName}/packages/shared-process/node_modules/vscode-ripgrep-with-github-api-error-fix`
  )
  await Replace.replace({
    path: `build/.tmp/arch-linux/x64/usr/lib/${product.applicationName}/packages/shared-process/src/parts/RgPath/RgPath.js`,
    occurrence: `export { rgPath } from 'vscode-ripgrep-with-github-api-error-fix'`,
    replacement: `export const rgPath = 'rg'`,
  })
  // because of using system electron, argv will be /usr/lib/electron /usr/lib/appName <path>
  await Replace.replace({
    path: `build/.tmp/arch-linux/x64/usr/lib/${product.applicationName}/packages/main-process/src/parts/Cli/Cli.js`,
    occurrence: `const relevantArgv = argv.slice(1)`,
    replacement: `const relevantArgv = argv.slice(2)`,
  })
}

const copyMetaFiles = async ({ product }) => {
  const arch = ArchType.X64
  await Template.write('linux_desktop', `build/.tmp/arch-linux/${arch}/usr/share/applications/${product.applicationName}.desktop`, {
    '@@NAME_LONG@@': product.nameLong,
    '@@NAME_SHORT@@': product.nameShort,
    '@@NAME@@': product.applicationName,
    '@@EXEC@@': `${product.applicationName} %U`,
    '@@ICON@@': product.applicationName,
    '@@URL_PROTOCOL@@': product.applicationName,
    '@@SUMMARY@@': product.linuxSummary,
    '@@KEYWORDS@@': `${product.applicationName};`,
  })
  await Template.write('bash_completion', `build/.tmp/arch-linux/${arch}/usr/share/bash-completion/completions/${product.applicationName}`, {
    '@@APPNAME@@': product.applicationName,
  })
  const version = (await Tag.getSemverVersion()) + '-1'
  const buildDate = new Date().getTime()
  await Template.write('arch_linux_pkginfo', `build/.tmp/arch-linux/${arch}/.PKGINFO`, {
    '@@APPNAME@@': product.applicationName,
    '@@VERSION@@': version,
    '@@PACKAGER@@': product.linuxMaintainer,
    '@@LICENSE@@': product.licenseName,
    '@@SIZE@@': '1000',
    '@@BUILD_DATE@@': `${buildDate}`,
  })
  await Template.write(
    'arch_linux_bin',
    `build/.tmp/arch-linux/${arch}/usr/bin/${product.applicationName}`,
    {
      '@@APPNAME@@': product.applicationName,
    },
    755
  )
  await Template.write('arch_linux_install', `build/.tmp/arch-linux/${arch}/.INSTALL`, {})
  await Copy.copyFile({
    from: 'build/files/icon.png',
    to: `build/.tmp/arch-linux/${arch}/usr/share/pixmaps/${product.applicationName}.png`,
  })

  // TODO
  // const installedSize = await getInstalledSize(
  //   Path.absolute(`build/.tmp/linux/arch/${arch}/app`)
  // )
  // const tag = await Tag.getGitTag()
}

const isFakeRoot = () => {
  // https://stackoverflow.com/questions/33446353/bash-check-if-user-is-root
  const ldLibraryPath = process.env.LD_LIBRARY_PATH
  return ldLibraryPath && ldLibraryPath.includes('libfakeroot')
}

const isIncludededMtreeDirent = (dirent) => {
  if (dirent === '.MTREE') {
    return false
  }
  if (dirent === '.PKGINFO') {
    return false
  }
  return true
}

const getOtherDirents = async () => {
  const dirents = await ReadDir.readDir(Path.absolute('build/.tmp/arch-linux/x64'))
  const filteredDirents = [...dirents.filter(isIncludededMtreeDirent)]
  return filteredDirents
}

const createMTree = async () => {
  const otherDirents = await getOtherDirents()
  await Compress.createMTree(Path.absolute(`build/.tmp/arch-linux/x64`), [
    '.PKGINFO', // .PKGINFO must be the first file in the archive
    ...otherDirents,
  ])
}

const compress = async ({ product }) => {
  const cwd = Path.absolute(`build/.tmp/arch-linux/x64`)
  const outFile = Path.absolute(`build/.tmp/releases/${product.applicationName}.tar.xz`)
  const otherDirents = await getOtherDirents()
  await Mkdir.mkdir(`build/.tmp/releases`)
  await Compress.tarXzFolders(
    [
      '.MTREE', // .MTREE must be the first file in the archive
      '.PKGINFO', // .PKGINFO must be the second file in the archive
      ...otherDirents,
    ],
    outFile,
    {
      cwd,
    }
  )
}

const printFinalSize = async ({ product }) => {
  try {
    const size = await Stat.getFileSize(Path.absolute(`build/.tmp/releases/${product.applicationName}.tar.xz`))
    Logger.info(`tar xz size: ${size}`)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to print tar xz size`)
  }
}

export const build = async ({ product }) => {
  if (!isFakeRoot()) {
    Logger.info('[info] enabling fakeroot')
    await Exec.exec('fakeroot', Process.argv, { stdio: 'inherit' })
    return
  }
  console.time('copyElectronResult')
  await copyElectronResult({ product })
  console.timeEnd('copyElectronResult')

  console.time('copyMetaFiles')
  await copyMetaFiles({ product })
  console.timeEnd('copyMetaFiles')

  console.time('createMTree')
  await createMTree()
  console.timeEnd('createMTree')

  console.time('compress')
  await compress({ product })
  console.timeEnd('compress')

  await printFinalSize({ product })
}
