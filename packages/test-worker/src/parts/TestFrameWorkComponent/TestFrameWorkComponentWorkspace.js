import * as Command from '../Command/Command.js'

export const setPath = async (path) => {
  await Command.execute('Workspace.setPath', path)
}
