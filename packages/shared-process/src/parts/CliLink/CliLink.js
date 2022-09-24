import * as ExtensionLink from '../ExtensionLink/ExtensionLink.js'

export const handleCliArgs = async (argv, console) => {
  const path = argv.length > 1 ? argv[1] : process.cwd()
  await ExtensionLink.link(path)
}
