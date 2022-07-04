import minimist from 'minimist'

const getBuildModule = (target) => {
  console.log({ target })
  switch (target) {
    case 'remote':
      return import('./parts/Remote/Remote.js')
    case 'electron-deb':
      return import('./parts/Deb/Deb.js')
    case 'electron-snap':
      return import('./parts/Snap/Snap.js')
    case 'electron-rpm':
      return import('./parts/Rpm/Rpm.js')
    case 'static':
    case 'bundle/static':
      return import('./parts/Static/Static.js')
    case 'bundle/electron':
    case 'electron-bundle':
      return import('./parts/BundleElectronApp/BundleElectronApp.js')
    case 'snap-internal':
      return import('./parts/SnapInternal/SnapInternal.js')
    case 'electron-builder':
    case 'electron-builder-deb':
      return import('./parts/ElectronBuilderDeb/ElectronBuilderDeb.js')
    case 'electron-builder-arch-linux':
      return import(
        './parts/ElectronBuilderArchLinux/ElectronBuilderArchLinux.js'
      )
    case 'electron-builder-windows-exe':
      return import(
        './parts/ElectronBuilderWindowsExe/ElectronBuilderWindowsExe.js'
      )
    case 'electron-builder-snap':
      return import('./parts/ElectronBuilderSnap/ElectronBuilderSnap.js')
    case 'electron-builder-mac':
      return import('./parts/ElectronBuilderMac/ElectronBuilderMac.js')
    case 'standalone-editor':
      return import('./parts/BuildEditor/BuildEditor.js')
    case 'server':
      return import('./parts/BuildServer/BuildServer.js')
    default:
      console.info(`unknown target "${target}"`)
      process.exit(1)
  }
}

// TODO warn when build dependencies are not yet installed

const main = async () => {
  const argv = minimist(process.argv.slice(2))
  const target = argv.target
  if (!target) {
    console.error('Error: target not specified')
    console.error(`Hint: Try using "node build.js --target=static"`)
    process.exit(1)
  }
  const module = await getBuildModule(target)
  try {
    await module.build()
  } catch (error) {
    throw new Error('Build failed', {
      // @ts-ignore
      cause: error,
    })
  }
}

main()
