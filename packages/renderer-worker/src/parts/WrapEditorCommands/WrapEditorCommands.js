import * as EditorWorker from '../EditorWorker/EditorWorker.ts'

const queues = new Map()

const runEditorCommand = async (editor, fullId, restArgs) => {
  await EditorWorker.invoke(fullId, editor.uid, ...restArgs)
  const diffResult = await EditorWorker.invoke('Editor.diff2', editor.uid)
  const commands = await EditorWorker.invoke('Editor.render2', editor.uid, diffResult)
  return {
    ...editor,
    commands,
  }
}

export const wrapEditorCommand = (id) => {
  return async (...args) => {
    if (args.length === 0) {
      throw new Error('missing arg')
    }
    const editor = args[0]
    const restArgs = args.slice(1)
    const fullId = id.includes('.') ? id : `Editor.${id}`
    if (fullId === 'Editor.openFind' || fullId === 'Editor.openFind2' || fullId === 'Editor.closeFind') {
      return runEditorCommand(editor, fullId, restArgs)
    }
    const previous = queues.get(editor.uid)
    const { promise: next, resolve } = Promise.withResolvers()
    queues.set(editor.uid, next)

    if (previous) {
      await previous
    }
    try {
      return await runEditorCommand(editor, fullId, restArgs)
    } finally {
      resolve(undefined)
      if (queues.get(editor.uid) === next) {
        queues.delete(editor.uid)
      }
    }
  }
}

export const wrapEditorCommands = (ids) => {
  let all = Object.create(null)
  for (const id of ids) {
    all[id] = wrapEditorCommand(id)
  }
  return all
}
