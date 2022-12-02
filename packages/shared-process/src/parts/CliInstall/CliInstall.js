import * as ExtensionInstall from '../ExtensionInstall/ExtensionInstall.js'
import * as Logger from '../Logger/Logger.js'

export const handleCliArgs = async (argv, console) => {
  const extension = argv[1]
  if (!extension) {
    Logger.error('extension argument is required')
    return
  }
  await ExtensionInstall.install(extension)
}
