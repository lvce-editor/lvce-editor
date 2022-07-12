import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeProviders = async (
  event,
  method,
  params,
  errorMessage,
  combineResults
) => {
  const extensionHosts = await ExtensionHostManagement.activateByEvent(event)
  if (extensionHosts.length === 0) {
    throw new Error(errorMessage)
  }
  const promises = []
  for (const extensionHost of extensionHosts) {
    promises.push(extensionHost.invoke(method, ...params))
  }
  const results = await Promise.all(promises)
  const combinedResult = combineResults(results)
  return combinedResult
}

export const executeProvider = async ({
  event,
  method,
  params,
  noProviderFoundMessage,
}) => {
  const extensionHosts = await ExtensionHostManagement.activateByEvent(event)
  if (extensionHosts.length === 0) {
    throw new Error(noProviderFoundMessage)
  }
  const promises = []
  for (const extensionHost of extensionHosts) {
    promises.push(extensionHost.invoke(method, ...params))
  }
  const results = await Promise.all(promises)
  return results[0]
}
