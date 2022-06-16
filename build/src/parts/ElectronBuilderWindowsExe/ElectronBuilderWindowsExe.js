import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.js'

export const build = async () => {
  if (process.platform === 'linux') {
    console.info('building windows exe is not supported on linux')
    process.exit(1)
  }
  if (process.platform === 'darwin') {
    console.info('building windows exe is not supported on macos')
    process.exit(1)
  }
  await ElectronBuilder.build({
    config: 'electron_builder_windows_exe',
  })
}
