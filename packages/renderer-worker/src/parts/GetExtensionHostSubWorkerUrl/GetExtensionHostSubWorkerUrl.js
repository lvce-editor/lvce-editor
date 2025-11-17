import * as ExtensionHostSubWorkerUrl from '../ExtensionHostSubWorkerUrl/ExtensionHostSubWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const getExtensionHostSubWorkerUrl = () => {
  return getConfiguredWorkerUrl('develop.extensionHostSubWorkerPath', ExtensionHostSubWorkerUrl.extensionHostSubWorkerUrl)
}
