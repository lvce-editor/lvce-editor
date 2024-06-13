import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const getLanguageConfiguration = (editor) => {
  return RendererWorker.invoke('Languages.getLanguageConfiguration', {
    uri: editor.uri,
    languageId: editor.languageId,
  })
}
