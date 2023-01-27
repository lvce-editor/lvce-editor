import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.js'
import * as Process from '../Process/Process.js'
import * as Logger from '../Logger/Logger.js'

export const build = async ({ product }) => {
  if (Process.platform === 'linux') {
    Logger.info('building macos dmg is not supported on linux')
    Process.exit(1)
  }
  if (Process.platform === 'win32') {
    Logger.info('building macos dmg is not supported on windows')
    Process.exit(1)
  }
  await ElectronBuilder.build({
    config: 'electron_builder_mac',
    product,
  })
}
