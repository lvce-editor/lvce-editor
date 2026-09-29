import * as Command from '../Command/Command.js'
import * as PathToFileUri from '../PathToFileUri/PathToFileUri.js'
import * as Prompt from '../Prompt/Prompt.js'

export const openFolder = async () => {
  const path = await Prompt.prompt('Choose Path:', '/home')
  if (!path) {
    return
  }
  const uri = PathToFileUri.pathToFileUri(path)
  await Command.execute(/* Workspace.setUri */ 'Workspace.setUri', /* uri */ uri)
}
