import minimist from 'minimist'
import * as ExitCode from './parts/ExitCode/ExitCode.js'
import * as Logger from './parts/Logger/Logger.js'
import * as SetStackTraceLimit from './parts/SetStackTraceLimit/SetStackTraceLimit.js'
import * as Process from './parts/Process/Process.js'

const getProduct = (productName) => {
  switch (productName) {
    case 'lvce':
      // @ts-ignore
      return import('../files/products/lvce.js')
    default:
      // @ts-ignore
      return import('../files/products/lvce-oss.js')
  }
}

// @ts-ignore
const getBuildModule = (target) => {
  console.log({ target })
  switch (target) {
    case 'remote':
      return import('./parts/Remote/Remote.js')
    case 'electron-deb':
      return import('./parts/BuildDeb/BuildDeb.js')
    case 'electron-rpm':
      return import('./parts/Rpm/Rpm.js')
    case 'static':
    case 'bundle/static':
      return import('./parts/BuildStatic/BuildStatic.js')
    case 'bundle/electron':
    case 'electron-bundle':
      return import('./parts/BundleElectronApp/BundleElectronApp.js')
    case 'snap-internal':
      return import('./parts/SnapInternal/SnapInternal.js')
    case 'electron-builder':
    case 'electron-builder-deb':
      return import('./parts/ElectronBuilderDeb/ElectronBuilderDeb.js')
    case 'electron-builder-arch-linux':
      return import('./parts/ElectronBuilderArchLinux/ElectronBuilderArchLinux.js')
    case 'electron-builder-windows-exe':
      return import('./parts/ElectronBuilderWindowsExe/ElectronBuilderWindowsExe.js')
    case 'electron-builder-snap':
      return import('./parts/ElectronBuilderSnap/ElectronBuilderSnap.js')
    case 'electron-builder-mac':
      return import('./parts/ElectronBuilderMac/ElectronBuilderMac.js')
    case 'standalone-editor':
      return import('./parts/BuildEditor/BuildEditor.js')
    case 'server':
      return import('./parts/BuildServer/BuildServer.js')
    case 'arch-linux':
      return import('./parts/BuildArchLinux/BuildArchLinux.js')
    case 'electron-builder-app-image':
      return import('./parts/ElectronBuilderAppImage/ElectronBuilderAppImage.js')
    default:
      Logger.info(`unknown target "${target}"`)
      Process.exit(ExitCode.Error)
  }
}

// TODO warn when build dependencies are not yet installed

const main = async () => {
  const argv = minimist(Process.argv.slice(2))
  const target = argv.target
  const arch = argv.arch || process.arch
  if (!target) {
    console.error('Error: target not specified')
    console.error(`Hint: Try using "node build.js --target=static"`)
    Process.exit(ExitCode.Error)
  }
  SetStackTraceLimit.setStackTraceLimit(100)
  const product = await getProduct(argv.product)
  const module = await getBuildModule(target)
  try {
    // @ts-ignore
    await module.build({ product, arch, target })
  } catch (error) {
    console.error(`Build failed:`)
    console.error(error)
    Process.exit(ExitCode.Error)
  }
}

main()
