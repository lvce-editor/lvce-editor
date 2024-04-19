import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.js'
import * as ElectronBuilderConfigType from '../ElectronBuilderConfigType/ElectronBuilderConfigType.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Logger from '../Logger/Logger.js'
import * as Process from '../Process/Process.js'

export const build = async ({ product, arch }) => {
  if (Process.platform === 'win32') {
    Logger.info('building appImage is not supported on windows')
    Process.exit(ExitCode.Error)
  }
  // @ts-ignore
  await ElectronBuilder.build({
    config: ElectronBuilderConfigType.AppImage,
    product,
    arch,
  })
}
