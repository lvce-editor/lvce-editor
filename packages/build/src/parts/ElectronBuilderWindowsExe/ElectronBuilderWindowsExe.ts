import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.ts'
import * as ElectronBuilderConfigType from '../ElectronBuilderConfigType/ElectronBuilderConfigType.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Platform from '../Platform/Platform.ts'
import * as Process from '../Process/Process.ts'

export const build = async ({ product, arch, asar }) => {
  if (Platform.isLinux()) {
    Logger.info('building windows exe is not supported on linux')
    Process.exit(ExitCode.Error)
  }
  if (Platform.isMacos()) {
    Logger.info('building windows exe is not supported on macos')
    Process.exit(ExitCode.Error)
  }
  // @ts-ignore
  await ElectronBuilder.build({
    config: ElectronBuilderConfigType.WindowsExe,
    product,
    asar,
    shouldRemoveUnusedLocales: true,
    arch,
    platform: 'win32',
  })
}
