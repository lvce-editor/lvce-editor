import electronInstaller from 'electron-winstaller'
import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import VError from 'verror'
import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import * as Product from '../Product/Product.js'
import * as Rename from '../Rename/Rename.js'
import * as Stat from '../Stat/Stat.js'
import * as Tag from '../Tag/Tag.js'

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

const renameReleaseFile = async () => {
  const finalFileName = `${Product.applicationName}-setup.exe`
  const releaseFileName = `${Product.applicationName}-setup.exe`
  const releaseFilePath = `build/.tmp/releases/${releaseFileName}`
  await Rename.rename({
    from: finalFileName,
    to: releaseFilePath,
  })
  return releaseFilePath
}

const runElectronWindowsInstaller = async ({ version }) => {
  try {
    // const versionThatWorksOnWindows = version.replace(/\-.*$/, '')
    const versionThatWorksOnWindows = '1.0.1'
    console.log({ versionThatWorksOnWindows })
    await electronInstaller.createWindowsInstaller({
      appDirectory: Path.absolute('build/.tmp/electron-bundle/x64'),
      outputDirectory: Path.absolute('build/.tmp/electron-windows-installer'),
      authors: 'My App Inc.',
      // exe: 'myapp.exe',
      description: 'Code Editor',
      version: versionThatWorksOnWindows,
      noMsi: true,
      name: Product.nameShort,
      title: Product.nameShort,
    })
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to run electron windows installer`)
  }
}

export const build = async () => {
  const version = await Tag.getGitTag()

  console.time('copyElectronResult')
  await copyElectronResult()
  console.timeEnd('copyElectronResult')

  console.time('copyBuildResources')
  await copyBuildResources()
  console.timeEnd('copyBuildResources')

  console.time('runElectronWindowsInstaller')
  await runElectronWindowsInstaller({ version })
  console.timeEnd('runElectronWindowsInstaller')

  console.time('renameReleaseFile')
  const releaseFilePath = await renameReleaseFile()
  console.timeEnd('renameReleaseFile')

  await printFinalSize(releaseFilePath)
}
