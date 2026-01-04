import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'

export const executeProviders = async ({
  event,
  method,
  params,
  noProviderFoundMessage = 'No provider found',
  noProviderFoundResult,
  combineResults,
  assetDir,
  platform,
}) => {
  await ExtensionHostManagement.activateByEvent(event, assetDir, platform)
  const result = await ExtensionHostWorker.invoke(method, ...params)
  return result
}

export const executeProvider = async ({ event, method, params, noProviderFoundMessage, assetDir, platform }) => {
  await ExtensionHostManagement.activateByEvent(event, assetDir, platform)
  const result = ExtensionHostWorker.invoke(method, ...params)
  return result
}

export const execute = async ({ method, params }) => {
  await ExtensionHostWorker.invoke(method, ...params)
}
