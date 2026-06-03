import { assetDir } from '../AssetDir/AssetDir.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import { getPlatform } from '../Platform/Platform.js'

export interface ExtensionViewIframe {
  readonly csp: string
  readonly credentialless: boolean
  readonly sandbox: readonly string[]
  readonly src: string
}

export interface ExtensionView {
  readonly extensionId: string
  readonly icon: string
  readonly id: string
  readonly iframe?: ExtensionViewIframe
  readonly title: string
}

export const getExtensionViews = async (): Promise<readonly ExtensionView[]> => {
  return ExtensionManagementWorker.invoke('Extensions.getViews', assetDir, getPlatform())
}

export const getExtensionView = async (id: string): Promise<ExtensionView | undefined> => {
  const views = await getExtensionViews()
  return views.find((view) => view.id === id)
}
