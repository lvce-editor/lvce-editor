import * as Command from '../Command/Command.ts'

// @ts-ignore
export const findAllReferences = async (editor) => {
  await Command.execute('SideBar.show', 'References', /* focus */ true)
  return editor
}
