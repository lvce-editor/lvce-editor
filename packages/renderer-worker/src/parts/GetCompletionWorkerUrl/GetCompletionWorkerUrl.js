import * as CompletionWorkerUrl from '../CompletionWorkerUrl/CompletionWorkerUrl.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'

export const getCompletionWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.completionWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || CompletionWorkerUrl.completionWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = CompletionWorkerUrl.completionWorkerUrl
  }
  return configuredWorkerUrl
}
