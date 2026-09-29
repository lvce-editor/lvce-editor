import * as ExtensionList from '../ExtensionList/ExtensionList.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as Logger from '../Logger/Logger.ts'

const getOutputLine = (extension: any): any => {
  if (extension.symlink) {
    return `${extension.id} -> ${extension.symlink}`
  }
  return `${extension.id}: ${extension.version}`
}

const getOutput = (extensions: any): any => {
  const lines = extensions.map(getOutputLine)
  return JoinLines.joinLines(lines)
}

export const handleCliArgs = async (argv: any): Promise<any> => {
  const extensions = await ExtensionList.list()
  const output = getOutput(extensions)
  Logger.info(output)
}
