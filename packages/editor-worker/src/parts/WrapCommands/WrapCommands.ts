import * as Editors from '../Editors/Editors.ts'
import * as RenderEditor from '../RenderEditor/RenderEditor.ts'
import * as UnwrappedCommands from '../UnwrappedCommands/UnwrappedCommands.ts'

// TODO wrap commands globally, not per editor
// TODO only store editor state in editor worker, not in renderer worker also
const wrapCommand =
  (fn: any) =>
  async (editorUid: number, ...args: any[]) => {
    const oldInstance = Editors.get(editorUid)
    const newEditor = await fn(oldInstance.newState, ...args)
    Editors.set(editorUid, oldInstance.newState, newEditor)
    const commands = RenderEditor.renderEditor(editorUid)
    newEditor.commands = commands
    return newEditor
  }

export const wrapCommands = (commands: any) => {
  for (const [key, value] of Object.entries(commands)) {
    if (UnwrappedCommands.keep.includes(key)) {
      continue
    }
    commands[key] = wrapCommand(value)
  }
}
