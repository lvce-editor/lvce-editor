import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.js'
import * as Process from '../Process/Process.js'

export const build = async () => {
  if (Process.platform === 'linux') {
    console.info('building macos dmg is not supported on linux')
    Process.exit(1)
  }
  if (Process.platform === 'win32') {
    console.info('building macos dmg is not supported on windows')
    Process.exit(1)
  }
  await ElectronBuilder.build({
    config: 'electron_builder_mac',
  })
}
