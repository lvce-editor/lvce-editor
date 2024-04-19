import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.js'
import * as ElectronBuilderConfigType from '../ElectronBuilderConfigType/ElectronBuilderConfigType.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Logger from '../Logger/Logger.js'
import * as Process from '../Process/Process.js'

export const build = async ({ product, arch }) => {
  if (Process.platform === 'linux') {
    Logger.info('building macos dmg is not supported on linux')
    Process.exit(ExitCode.Error)
  }
  if (Process.platform === 'win32') {
    Logger.info('building macos dmg is not supported on windows')
    Process.exit(ExitCode.Error)
  }
  // @ts-ignore
  await ElectronBuilder.build({
    config: ElectronBuilderConfigType.Mac,
    product,
    arch,
    isMacos: true,
    platform: 'darwin',
    shouldRemoveUnusedLocales: true,
  })
}
