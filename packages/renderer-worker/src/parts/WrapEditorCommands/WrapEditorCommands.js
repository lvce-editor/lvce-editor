import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const queues = new Map()

const isTextEditor = (instance) => {
  return instance?.moduleId === 'Editor' || instance?.moduleId === 'EditorText'
}

const getEditorUids = (editor) => {
  const uids = new Set([editor.uid])
  for (const instance of Object.values(ViewletStates.getAllInstances())) {
    const state = instance?.state
    if (isTextEditor(instance) && state?.uri === editor.uri && typeof state.uid === 'number') {
      uids.add(state.uid)
    }
  }
  return uids
}

const getExistingEditorUids = async (editor) => {
  const editorUids = [...getEditorUids(editor)]
  if (editorUids.length === 1) {
    return editorUids
  }
  const keys = await EditorWorker.invoke('Editor.getKeys')
  if (!Array.isArray(keys)) {
    return editorUids
  }
  const existingUids = new Set(keys.map(Number))
  return editorUids.filter((uid) => existingUids.has(uid))
}

const adjustCommands = (commands, uid) => {
  return commands.map((command) => {
    if (typeof command[0] === 'string' && command[0].startsWith('Viewlet.')) {
      return command
    }
    return ['Viewlet.send', uid, ...command]
  })
}

const renderEditor = async (uid, sourceUid) => {
  const diffResult = await EditorWorker.invoke('Editor.diff2', uid)
  const commands = await EditorWorker.invoke('Editor.render2', uid, diffResult)
  return uid === sourceUid ? commands : adjustCommands(commands, uid)
}

const runEditorCommand = async (editor, fullId, restArgs) => {
  await EditorWorker.invoke(fullId, editor.uid, ...restArgs)
  const editorUids = await getExistingEditorUids(editor)
  const commandLists = await Promise.all(editorUids.map((uid) => renderEditor(uid, editor.uid)))
  return {
    ...editor,
    commands: commandLists.flat(),
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
    const queueKey = editor.uri || editor.uid
    const previous = queues.get(queueKey)
    const { promise: next, resolve } = Promise.withResolvers()
    queues.set(queueKey, next)

    if (previous) {
      await previous
    }
    try {
      return await runEditorCommand(editor, fullId, restArgs)
    } finally {
      resolve(undefined)
      if (queues.get(queueKey) === next) {
        queues.delete(queueKey)
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
