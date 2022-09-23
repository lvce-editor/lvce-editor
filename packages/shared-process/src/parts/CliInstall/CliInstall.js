import * as ExtensionInstall from '../ExtensionInstall/ExtensionInstall.js'

export const handleCliArgs = async (argv) => {
  const extension = argv[1]
  if (!extension) {
    console.error('extension argument is required')
    return
  }
  await ExtensionInstall.install(extension)
}
