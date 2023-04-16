import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.js'
import * as ElectronBuilderConfigType from '../ElectronBuilderConfigType/ElectronBuilderConfigType.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Logger from '../Logger/Logger.js'
import * as Process from '../Process/Process.js'

export const build = async ({ product }) => {
  if (Process.platform === 'win32') {
    Logger.info('building deb is not supported on windows')
    Process.exit(ExitCode.Error)
  }
  await ElectronBuilder.build({
    config: ElectronBuilderConfigType.Deb,
    product,
  })
}
