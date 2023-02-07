import * as ExtensionList from '../ExtensionList/ExtensionList.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as Logger from '../Logger/Logger.js'

const getOutputLine = (extension) => {
  return `${extension.id}: ${extension.version}`
}

const getOutput = (extensions) => {
  const lines = extensions.map(getOutputLine)
  return JoinLines.joinLines(lines)
}

export const handleCliArgs = async (argv) => {
  const extensions = await ExtensionList.list()
  const output = getOutput(extensions)
  Logger.info(output)
}
