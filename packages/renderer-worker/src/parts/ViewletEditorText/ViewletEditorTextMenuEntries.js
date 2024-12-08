import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const getQuickPickMenuEntries = async () => {
  // @ts-ignore
  const entries = await EditorWorker.invoke('Editor.getQuickPickMenuEntries')
  return entries
}
