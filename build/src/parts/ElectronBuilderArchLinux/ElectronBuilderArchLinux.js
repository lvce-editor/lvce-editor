import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.js'

export const build = async () => {
  if (process.platform === 'win32') {
    console.info('building for arch linux is not supported on windows')
    process.exit(1)
  }
  await ElectronBuilder.build({
    config: 'electron_builder_arch_linux',
  })
}
