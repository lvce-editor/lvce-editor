import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.js'
import * as Process from '../Process/Process.js'

export const build = async () => {
  if (Process.platform === 'win32') {
    console.info('building for arch linux is not supported on windows')
    Process.exit(1)
  }
  await ElectronBuilder.build({
    config: 'electron_builder_arch_linux',
  })
}
