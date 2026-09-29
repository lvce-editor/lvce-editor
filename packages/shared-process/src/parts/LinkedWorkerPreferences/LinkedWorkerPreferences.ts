import * as LinkedWorkerManifest from '../LinkedWorkerManifest/LinkedWorkerManifest.ts'
import * as TransientLinkedExtensions from '../TransientLinkedExtensions/TransientLinkedExtensions.ts'

export const getLinkedWorkerPreferences = async (): Promise<Record<string, string>> => {
  const preferences: Record<string, string> = {}
  for (const link of TransientLinkedExtensions.getLinkedExtensions()) {
    const preference = await LinkedWorkerManifest.getLinkedWorkerPreference(link.resolvedPath)
    if (!preference) {
      continue
    }
    preferences[preference.settingName] = preference.path
  }
  return preferences
}
