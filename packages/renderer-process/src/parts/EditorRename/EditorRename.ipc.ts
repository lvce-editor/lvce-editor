import * as EditorRename from './EditorRename.ts'

export const name = 'EditorRename'

export const Commands = {
  create: EditorRename.create,
  dispose: EditorRename.dispose,
  finish: EditorRename.finish,
}
