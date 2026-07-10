import minimist from 'minimist'
import * as ExitCode from './parts/ExitCode/ExitCode.ts'
import * as Logger from './parts/Logger/Logger.ts'
import * as SetStackTraceLimit from './parts/SetStackTraceLimit/SetStackTraceLimit.ts'
import * as Process from './parts/Process/Process.ts'

const getProduct = (productName) => {
  switch (productName) {
    case 'lvce':
      // @ts-ignore
      return import('../files/products/lvce.ts')
    default:
      // @ts-ignore
      return import('../files/products/lvce-oss.ts')
  }
}

// @ts-ignore
const getBuildModule = (target) => {
  console.log({ target })
  switch (target) {
    case 'remote':
      return import('./parts/Remote/Remote.ts')
    case 'electron-deb':
      return import('./parts/BuildDeb/BuildDeb.ts')
    case 'electron-rpm':
      return import('./parts/Rpm/Rpm.ts')
    case 'static':
    case 'bundle/static':
      return import('./parts/BuildStatic/BuildStatic.ts')
    case 'bundle/electron':
    case 'electron-bundle':
      return import('./parts/BundleElectronApp/BundleElectronApp.ts')
    case 'snap-internal':
      return import('./parts/SnapInternal/SnapInternal.ts')
    case 'electron-builder':
    case 'electron-builder-deb':
      return import('./parts/ElectronBuilderDeb/ElectronBuilderDeb.ts')
    case 'electron-builder-arch-linux':
      return import('./parts/ElectronBuilderArchLinux/ElectronBuilderArchLinux.ts')
    case 'electron-builder-windows-exe':
      return import('./parts/ElectronBuilderWindowsExe/ElectronBuilderWindowsExe.ts')
    case 'electron-builder-snap':
      return import('./parts/ElectronBuilderSnap/ElectronBuilderSnap.ts')
    case 'electron-builder-mac':
      return import('./parts/ElectronBuilderMac/ElectronBuilderMac.ts')
    case 'standalone-editor':
      return import('./parts/BuildEditor/BuildEditor.ts')
    case 'server':
      return import('./parts/BuildServer/BuildServer.ts')
    case 'arch-linux':
      return import('./parts/BuildArchLinux/BuildArchLinux.ts')
    case 'electron-builder-app-image':
      return import('./parts/ElectronBuilderAppImage/ElectronBuilderAppImage.ts')
    default:
      Logger.info(`unknown target "${target}"`)
      Process.exit(ExitCode.Error)
  }
}

// TODO warn when build dependencies are not yet installed

const main = async () => {
  const argv = minimist(Process.argv.slice(2), {
    boolean: ['asar'],
    default: {
      asar: false,
    },
  })
  const target = argv.target
  const arch = argv.arch || process.arch
  const asar = argv.asar
  if (!target) {
    console.error('Error: target not specified')
    console.error(`Hint: Try using "node build.ts --target=static"`)
    Process.exit(ExitCode.Error)
  }
  SetStackTraceLimit.setStackTraceLimit(100)
  const product = await getProduct(argv.product)
  const module = await getBuildModule(target)
  try {
    // @ts-ignore
    await module.build({ product, arch, target, asar })
  } catch (error) {
    console.error(`Build failed:`)
    console.error(error)
    Process.exit(ExitCode.Error)
  }
}

main()
