const map = Object.create(null)

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
    return newEditor
  }

export const wrapCommands = (commands: any) => {
  for (const [key, value] of Object.entries(commands)) {
    commands[key] = wrapCommand(value)
  }
}
