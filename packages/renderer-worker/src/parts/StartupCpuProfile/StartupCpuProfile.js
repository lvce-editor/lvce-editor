import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as GetActiveEditor from '../GetActiveEditor/GetActiveEditor.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const isEnabled = (href) => new URL(href).searchParams.get('cpuProfile') === '1'

export const complete = async () => {
  let failure = ''
  try {
    const editorId = GetActiveEditor.getActiveEditorId()
    if (editorId === -1) throw new Error('The requested file did not open in a text editor')
    await EditorWorker.invoke('Editor.waitForDiagnostics', editorId, 120_000)
  } catch (error) {
    failure = String(error)
  }
  await SharedProcess.invoke('StartupCpuProfile.complete', failure)
}
