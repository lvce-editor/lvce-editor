import { assetDir } from '../AssetDir/AssetDir.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import { getExtensionAbsolutePath } from '../GetExtensionAbsolutePath/GetExtensionAbsolutePath.js'
import { getPlatform } from '../Platform/Platform.js'

export interface ExtensionViewIframe {
  readonly csp: string
  readonly credentialless: boolean
  readonly sandbox: readonly string[]
  readonly src: string
}

export interface ExtensionView {
  readonly displayName?: string
  readonly css?: string
  readonly extensionId: string
  readonly icon: string
  readonly id: string
  readonly iframe?: ExtensionViewIframe
  readonly kind?: string
  readonly name?: string
  readonly title: string
}

interface ManifestView {
  readonly css?: string
  readonly id?: string
}

interface ExtensionManifest {
  readonly builtin?: boolean
  readonly id?: string
  readonly isWeb?: boolean
  readonly path?: string
  readonly uri?: string
  readonly views?: readonly ManifestView[]
}

const getOrigin = (): string => {
  return globalThis.location?.origin || 'http://localhost'
}

const getManifestView = (extension: ExtensionManifest, viewId: string): ManifestView | undefined => {
  return extension.views?.find((view) => view.id === viewId)
}

const getCss = (extension: ExtensionManifest, view: ExtensionView): string => {
  const manifestView = getManifestView(extension, view.id)
  const css = manifestView?.css
  if (typeof css !== 'string' || css.length === 0) {
    return ''
  }
  return getExtensionAbsolutePath(
    extension.id || view.extensionId,
    extension.isWeb === true,
    extension.builtin === true,
    extension.path || extension.uri || '',
    css,
    getOrigin(),
    getPlatform(),
  )
}

const mergeCss = (views: readonly ExtensionView[], extensions: readonly ExtensionManifest[]): readonly ExtensionView[] => {
  return views.map((view) => {
    if (view.css) {
      return view
    }
    const extension = extensions.find((extension) => extension.id === view.extensionId)
    if (!extension) {
      return view
    }
    const css = getCss(extension, view)
    if (!css) {
      return view
    }
    return {
      ...view,
      css,
    }
  })
}

export const getExtensionViews = async (): Promise<readonly ExtensionView[]> => {
  const [views, extensions] = await Promise.all([
    ExtensionManagementWorker.invoke('Extensions.getViews', assetDir, getPlatform()) as Promise<readonly ExtensionView[]>,
    ExtensionManagementWorker.invoke('Extensions.getAllExtensions', assetDir, getPlatform()) as Promise<readonly ExtensionManifest[]>,
  ])
  return mergeCss(views, extensions)
}

export const getExtensionView = async (id: string): Promise<ExtensionView | undefined> => {
  const views = await getExtensionViews()
  return views.find((view) => view.id === id)
}
