import * as ExtensionList from '../ExtensionList/ExtensionList.js'

export const handleCliArgs = async (argv) => {
  const extensions = await ExtensionList.list()
  process.stdout.write(JSON.stringify(extensions, null, 2))
}
