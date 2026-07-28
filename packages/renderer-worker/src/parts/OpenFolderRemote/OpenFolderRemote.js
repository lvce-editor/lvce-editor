import * as Command from '../Command/Command.js'
import * as Prompt from '../Prompt/Prompt.js'

const toFileUri = (path) => {
  const url = new URL('file:///')
  url.pathname = path.replaceAll('\\', '/')
  return url.toString()
}

export const openFolder = async () => {
  const path = await Prompt.prompt('Choose Path:', '/home')
  if (!path) {
    return
  }
  const uri = toFileUri(path)
  await Command.execute(/* Workspace.setUri */ 'Workspace.setUri', /* uri */ uri)
}
