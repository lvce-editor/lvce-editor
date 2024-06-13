import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const getLanguageConfiguration = (editor: any) => {
  return RendererWorker.invoke('Languages.getLanguageConfiguration', {
    uri: editor.uri,
    languageId: editor.languageId,
  })
}
