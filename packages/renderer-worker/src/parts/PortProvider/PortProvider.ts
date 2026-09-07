import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'

const schemePattern = /^([a-z][a-z0-9+.-]*):/i

export const getPorts = async (workspaceUri: string, applicationId?: string): Promise<readonly unknown[]> => {
  const scheme = schemePattern.exec(workspaceUri)?.[1].toLowerCase()
  if (!scheme) {
    return []
  }
  const args = [`onPorts:${scheme}`, 'ExtensionApi.providePorts', workspaceUri]
  const results =
    applicationId === undefined
      ? await ExtensionManagementWorker.invoke('Extensions.executeProvidersByEvent', ...args)
      : await ExtensionManagementWorker.invoke('Extensions.invokeForApplication', applicationId, 'Extensions.executeProvidersByEvent', ...args)
  return results.flat()
}
