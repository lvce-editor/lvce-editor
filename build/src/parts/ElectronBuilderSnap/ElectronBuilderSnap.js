import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.js'

export const build = async () => {
  if (process.platform === 'win32') {
    console.info('building snap is not supported on windows')
    process.exit(1)
  }
  if (process.platform === 'darwin') {
    console.info('building snap is not supported on macos')
    process.exit(1)
  }
  await ElectronBuilder.build({
    config: 'electron_builder_snap',
  })
}
