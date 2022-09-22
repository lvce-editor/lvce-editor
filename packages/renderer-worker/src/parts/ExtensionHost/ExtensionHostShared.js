import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.js'

export const executeProviders = async ({
  event,
  method,
  params,
  noProviderFoundMessage = 'No provider found',
  noProviderFoundResult,
  combineResults,
}) => {
  const extensionHosts = await ExtensionHostManagement.activateByEvent(event)
  if (extensionHosts.length === 0) {
    return noProviderFoundResult ?? undefined
  }
  const promises = []
  for (const extensionHost of extensionHosts) {
    promises.push(extensionHost.ipc.invoke(method, ...params))
  }
  const results = await Promise.all(promises)
  console.log({ results })
  const combinedResult = combineResults(results)
  console.log({ combinedResult })
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
    promises.push(extensionHost.ipc.invoke(method, ...params))
  }
  const results = await Promise.all(promises)
  return results[0]
}

export const execute = async ({ method, params, combineResults }) => {
  const extensionHosts = ExtensionHostManagement.getExtensionHosts()
  const results = []
  for (const extensionHost of extensionHosts) {
    const result = await extensionHost.ipc.invoke(method, ...params)
    results.push(result)
  }
  return combineResults(results)
}
