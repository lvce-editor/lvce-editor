import * as ExtensionUnlink from '../ExtensionUnlink/ExtensionUnlink.js'
import * as Process from '../Process/Process.js'

export const handleCliArgs = async (argv) => {
  const path = argv.length > 1 ? argv[1] : Process.cwd()
  await ExtensionUnlink.unlink(path)
}
