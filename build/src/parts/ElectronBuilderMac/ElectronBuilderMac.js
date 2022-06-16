import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.js'

export const build = async () => {
  if (process.platform === 'linux') {
    console.info('building macos dmg is not supported on linux')
    process.exit(1)
  }
  if (process.platform === 'win32') {
    console.info('building macos dmg is not supported on windows')
    process.exit(1)
  }
  await ElectronBuilder.build({
    config: 'electron_builder_mac',
  })
}
