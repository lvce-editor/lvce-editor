import * as ExtensionLink from '../ExtensionLink/ExtensionLink.js'

export const handleCliArgs = async (argv, console) => {
  console.log({ argv })
  const path = process.cwd()
  await ExtensionLink.link(path)
}
