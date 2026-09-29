import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.ts'
import * as ElectronBuilderConfigType from '../ElectronBuilderConfigType/ElectronBuilderConfigType.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Process from '../Process/Process.ts'

export const build = async ({ product, arch, asar }) => {
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
    asar,
    isMacos: true,
    platform: 'darwin',
    shouldRemoveUnusedLocales: true,
  })
}
