import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.js'
import * as Platform from '../Platform/Platform.js'
import * as Process from '../Process/Process.js'

export const build = async () => {
  if (Platform.isLinux()) {
    console.info('building windows exe is not supported on linux')
    Process.exit(1)
  }
  if (Platform.isMacos()) {
    console.info('building windows exe is not supported on macos')
    Process.exit(1)
  }
  await ElectronBuilder.build({
    config: 'electron_builder_windows_exe',
  })
}
