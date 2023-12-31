import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.js'
import * as ElectronBuilderConfigType from '../ElectronBuilderConfigType/ElectronBuilderConfigType.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Logger from '../Logger/Logger.js'
import * as Platform from '../Platform/Platform.js'
import * as Process from '../Process/Process.js'

export const build = async ({ product, arch }) => {
  if (Platform.isLinux()) {
    Logger.info('building windows exe is not supported on linux')
    Process.exit(ExitCode.Error)
  }
  if (Platform.isMacos()) {
    Logger.info('building windows exe is not supported on macos')
    Process.exit(ExitCode.Error)
  }
  await ElectronBuilder.build({
    config: ElectronBuilderConfigType.WindowsExe,
    product,
    shouldRemoveUnusedLocales: true,
    arch,
  })
}
