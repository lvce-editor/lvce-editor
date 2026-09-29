import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.ts'
import * as ElectronBuilderConfigType from '../ElectronBuilderConfigType/ElectronBuilderConfigType.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Process from '../Process/Process.ts'

export const build = async ({ product, arch, asar }) => {
  if (Process.platform === 'win32') {
    Logger.info('building appImage is not supported on windows')
    Process.exit(ExitCode.Error)
  }
  // @ts-ignore
  await ElectronBuilder.build({
    config: ElectronBuilderConfigType.AppImage,
    product,
    arch,
    asar,
  })
}
