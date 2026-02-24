import * as EditorWorker from '../EditorWorker/EditorWorker.ts'

export const wrapEditorCommand = (id) => {
  return async (...args) => {
    if (args.length === 0) {
      throw new Error('missing arg')
    }
    const editor = args[0]
    const restArgs = args.slice(1)
    const fullId = id.includes('.') ? id : `Editor.${id}`
    // @ts-ignore
    const result = await EditorWorker.invoke(fullId, editor.uid, ...restArgs)
    if (!result) {
      const commands = await EditorWorker.invoke('Editor.render', editor.uid)
      return {
        ...editor,
        commands,
      }
    }

    // deprecated
    if (result && result.commands) {
      return {
        ...editor,
        commands: result.commands,
      }
    }
    return result
  }
}

export const wrapEditorCommands = (ids) => {
  let all = Object.create(null)
  for (const id of ids) {
    all[id] = wrapEditorCommand(id)
  }
  return all
}
