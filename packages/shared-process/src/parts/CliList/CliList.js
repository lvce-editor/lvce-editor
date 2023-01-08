import * as ExtensionList from '../ExtensionList/ExtensionList.js'
import * as Logger from '../Logger/Logger.js'

const getOutputLine = (extension) => {
  return `${extension.id}: ${extension.version}`
}

const getOutput = (extensions) => {
  return extensions.map(getOutputLine).join('\n')
}

export const handleCliArgs = async (argv) => {
  const extensions = await ExtensionList.list()
  const output = getOutput(extensions)
  Logger.info(output)
}
