import * as ExtensionUnlink from '../ExtensionUnlink/ExtensionUnlink.js'

export const handleCliArgs = async (argv, console, process) => {
  const path = argv.length > 1 ? argv[1] : process.cwd()
  await ExtensionUnlink.unlink(path)
}
