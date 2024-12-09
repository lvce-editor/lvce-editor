import * as EditorWorker from '../EditorWorker/EditorWorker.ts'

export const getQuickPickMenuEntries = async () => {
  // @ts-ignore
  const entries = await EditorWorker.invoke('Editor.getQuickPickMenuEntries')
  return entries
}
