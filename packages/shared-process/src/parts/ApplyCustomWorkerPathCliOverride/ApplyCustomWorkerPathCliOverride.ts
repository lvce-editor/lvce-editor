import * as Process from '../Process/Process.ts'

const disableCustomWorkerPathsFlag = '--disable-custom-worker-paths'

const workerPathSettingsWithoutWorkerInName = new Set(['develop.languageModelsViewPath', 'develop.runningExtensionsViewPath'])

const isCustomWorkerPathSetting = (key: string): boolean => {
  const isDevelopmentSetting = key.startsWith('develop.') || key.startsWith('developer.')
  return isDevelopmentSetting && (key.endsWith('WorkerPath') || workerPathSettingsWithoutWorkerInName.has(key))
}

export const applyCustomWorkerPathCliOverride = (preferences: Record<string, any>): Record<string, any> => {
  if (!Process.argv.includes(disableCustomWorkerPathsFlag)) {
    return preferences
  }
  const filteredPreferences = { ...preferences }
  for (const key of Object.keys(filteredPreferences)) {
    if (isCustomWorkerPathSetting(key)) {
      delete filteredPreferences[key]
    }
  }
  return filteredPreferences
}
