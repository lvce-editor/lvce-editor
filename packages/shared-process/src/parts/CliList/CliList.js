import * as ExtensionList from '../ExtensionList/ExtensionList.js'
import * as Json from '../Json/Json.js'

const getOutputLine = (extension) => {
  return `${extension.id}: ${extension.version}`
}

const getOutput = (extensions) => {
  return extensions.map(getOutputLine).join('\n')
}

export const handleCliArgs = async (argv, console) => {
  const extensions = await ExtensionList.list()
  const output = getOutput(extensions)
  console.info(output)
}
