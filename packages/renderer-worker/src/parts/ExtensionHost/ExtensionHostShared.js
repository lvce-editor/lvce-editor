import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'

const getNoProviderResult = (noProviderFoundMessage, noProviderFoundResult) => {
  if (noProviderFoundResult !== undefined) {
    return noProviderFoundResult
  }
  throw new Error(noProviderFoundMessage)
}

/**
 * @param {any} options
 */
export const executeProviders = async (options) => {
  const { event, method, params, noProviderFoundMessage = 'No provider found', noProviderFoundResult, combineResults } = options
  const results = await ExtensionManagementWorker.invoke('Extensions.executeProvidersByEvent', event, method, ...params)
  if (results.length === 0) {
    return getNoProviderResult(noProviderFoundMessage, noProviderFoundResult)
  }
  if (combineResults) {
    return combineResults(results)
  }
  return results
}

/**
 * @param {any} options
 */
export const executeProvider = async (options) => {
  const { event, method, params, noProviderFoundMessage } = options
  const results = await ExtensionManagementWorker.invoke('Extensions.executeProvidersByEvent', event, method, ...params)
  if (results.length === 0) {
    return getNoProviderResult(noProviderFoundMessage)
  }
  return results[0]
}
