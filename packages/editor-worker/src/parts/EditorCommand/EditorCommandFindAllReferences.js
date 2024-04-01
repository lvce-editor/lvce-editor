import * as Command from '../Command/Command.js'

export const findAllReferences = async (editor) => {
  await Command.execute('SideBar.show', 'References', /* focus */ true)
  return editor
}
