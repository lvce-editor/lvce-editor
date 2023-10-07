import * as Command from '../Command/Command.js'
import * as Prompt from '../Prompt/Prompt.js'

export const openFolder = async () => {
  const path = await Prompt.prompt('Choose Path:', '/home')
  if (!path) {
    return
  }
  await Command.execute(/* Workspace.setPath */ 'Workspace.setPath', /* path */ path)
}
