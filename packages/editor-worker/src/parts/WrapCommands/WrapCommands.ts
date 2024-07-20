import * as Editors from '../Editors/Editors.ts'
import * as RenderEditor from '../RenderEditor/RenderEditor.ts'

const map = Object.create(null)

// TODO wrap commands globally, not per editor
// TODO only store editor state in editor worker, not in renderer worker also
const wrapCommand =
  (fn: any) =>
  async (editor: any, ...args: any[]) => {
    if (!map[editor.uid]) {
      map[editor.uid] = editor
    }
    const actual = map[editor.uid]
    const newEditor = await fn(actual, ...args)
    map[editor.uid] = newEditor

    if (editor.uid) {
      const oldInstance = Editors.get(editor.uid)
      Editors.set(editor.uid, oldInstance.newState, newEditor)
      const commands = RenderEditor.renderEditor(editor.uid)
      newEditor.commands = commands
    }
    return newEditor
  }

export const wrapCommands = (commands: any) => {
  for (const [key, value] of Object.entries(commands)) {
    commands[key] = wrapCommand(value)
  }
}
