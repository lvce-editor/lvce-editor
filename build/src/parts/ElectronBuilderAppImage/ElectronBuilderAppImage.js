import * as ElectronBuilder from '../ElectronBuilder/ElectronBuilder.js'
import * as Process from '../Process/Process.js'
import * as Logger from '../Logger/Logger.js'
import * as ElectronBuilderConfigType from '../ElectronBuilderConfigType/ElectronBuilderConfigType.js'

export const build = async ({ product }) => {
  if (Process.platform === 'win32') {
    Logger.info('building appImage is not supported on windows')
    Process.exit(1)
  }
  await ElectronBuilder.build({
    config: ElectronBuilderConfigType.AppImage,
    product,
  })
}
