import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'

export const executeProviders = async ({
  event,
  method,
  params,
  noProviderFoundMessage = 'No provider found',
  noProviderFoundResult,
  combineResults,
}) => {
  await ExtensionHostManagement.activateByEvent(event)
  const result = await ExtensionHostWorker.invoke(method, ...params)
  return result
}

export const executeProvider = async ({ event, method, params, noProviderFoundMessage }) => {
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

export const execute = async ({ method, params }) => {
  await ExtensionHostWorker.invoke(method, ...params)
}
