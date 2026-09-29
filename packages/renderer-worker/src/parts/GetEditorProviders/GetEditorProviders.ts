import * as GetExtensionViews from '../GetExtensionViews/GetExtensionViews.ts'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'

interface EditorProvider {
  readonly id: string
  readonly type?: string
}

export const mergeEditorProviders = (webViews: readonly EditorProvider[], extensionViews: readonly EditorProvider[]): readonly EditorProvider[] => {
  const providers = new Map<string, EditorProvider>()
  for (const provider of webViews) {
    if (provider?.id) {
      providers.set(provider.id, provider)
    }
  }
  for (const provider of extensionViews) {
    if (provider?.id && provider.type === 'preview') {
      providers.set(provider.id, provider)
    }
  }
  return [...providers.values()]
}

export const getEditorProviders = async (): Promise<readonly EditorProvider[]> => {
  const [webViews, extensionViews] = await Promise.all([GetWebViews.getWebViews(), GetExtensionViews.getExtensionViews()])
  return mergeEditorProviders(webViews, extensionViews)
}
