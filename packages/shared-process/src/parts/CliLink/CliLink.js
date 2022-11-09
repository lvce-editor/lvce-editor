import * as ExtensionLink from '../ExtensionLink/ExtensionLink.js'
import * as FileSystemErrorCodes from '../FileSystemErrorCodes/FileSystemErrorCodes.js'

export const handleCliArgs = async (argv) => {
  try {
    const path = argv.length > 1 ? argv[1] : process.cwd()
    await ExtensionLink.link(path)
  } catch (error) {
    if (error && error.code === FileSystemErrorCodes.E_MANIFEST_NOT_FOUND) {
      console.error(error.message)
      process.exitCode = 128
      return
    }
    throw error
  }
}
