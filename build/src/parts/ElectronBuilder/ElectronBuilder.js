import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import * as ElectronBuilder from 'electron-builder'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Product from '../Product/Product.js'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as Stat from '../Stat/Stat.js'
import * as Template from '../Template/Template.js'

// TODO don't need to include whole node-pty module
// TODO maybe don't need to include nan module
// TODO don't need to include whole vscode-ripgrep-with-github-api-error-fix module (only path)

const bundleElectronMaybe = async () => {
  if (
    existsSync(Path.absolute(`build/.tmp/bundle/electron-result`)) &&
    existsSync(
      Path.absolute(
        `build/.tmp/bundle/electron-result/resources/app/packages/main-process/dist/mainProcessMain.js`
      )
    )
  ) {
    console.info('[electron build skipped]')
    return
  }
  const { build } = await import('../BundleElectronApp/BundleElectronApp.js')
  await build()
}

const getElectronVersion = async () => {
  const packageJson = await ReadFile.readFile(
    'packages/main-process/package.json'
  )
  const parsed = JSON.parse(packageJson)
  const version = parsed.devDependencies.electron
  const parsedVersion = version.startsWith('^') ? version.slice(1) : version
  return parsedVersion
}

const copyElectronBuilderConfig = async (config) => {
  const electronVersion = await getElectronVersion()
  await Template.write(config, 'build/.tmp/electron-builder/package.json', {
    '@@NAME@@': Product.applicationName,
    '@@AUTHOR@@': Product.linuxMaintainer,
    '@@VERSION@@': Product.version,
    '@@HOMEPAGE@@': Product.homePage,
    '@@ELECTRON_VERSION@@': electronVersion,
    '@@NAME_LONG@@': Product.nameLong,
  })
}

const runElectronBuilder = async () => {
  await ElectronBuilder.build({
    projectDir: Path.absolute('build/.tmp/electron-builder'),
    prepackaged: Path.absolute(`build/.tmp/bundle/electron-result`),
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

const getFinalFileName = (config) => {
  switch (config) {
    case 'electron_builder_arch_linux':
      return `build/.tmp/electron-builder/dist/${Product.applicationName}-0.0.1.pacman`
    case 'electron_builder_deb':
      return `build/.tmp/electron-builder/dist/${Product.applicationName}_0.0.1_amd64.deb`
    case 'electron_builder_windows_exe':
      return `build/.tmp/electron-builder/dist/${Product.applicationName} Setup 0.0.1.exe`
    case 'electron_builder_snap':
      return `build/.tmp/electron-builder/dist/${Product.applicationName}_0.0.1_amd64.snap`
    case 'electron_builder_mac':
      return `build/.tmp/electron-builder/dist/${Product.applicationName}_0.0.1_amd64.dmg`
    default:
      throw new Error(`cannot get final file name for target ${config}`)
  }
}

const printFinalSize = async (config) => {
  try {
    const finalFileName = getFinalFileName(config)
    const size = await Stat.getFileSize(finalFileName)
    console.info(`final size: ${size}`)
  } catch (error) {
    console.warn(error)
    console.log(
      await readdir(Path.absolute('build/.tmp/electron-builder/dist/'))
    )
  }
}

export const build = async ({ config }) => {
  // workaround for https://github.com/electron-userland/electron-builder/issues/4594
  // @ts-ignore
  process.env.USE_HARD_LINKS = false

  console.time('bundleElectronMaybe')
  await bundleElectronMaybe()
  console.timeEnd('bundleElectronMaybe')

  console.time('copyElectronBuilderConfig')
  await copyElectronBuilderConfig(config)
  console.timeEnd('copyElectronBuilderConfig')

  console.time('copyBuildResources')
  await copyBuildResources()
  console.timeEnd('copyBuildResources')

  console.time('runElectronBuilder')
  await runElectronBuilder()
  console.timeEnd('runElectronBuilder')

  await printFinalSize(config)
}
