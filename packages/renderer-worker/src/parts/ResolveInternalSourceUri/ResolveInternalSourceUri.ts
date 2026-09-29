import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const internalSourcePrefixes = ['lvce://', 'lvce-oss://']

interface Invoke {
  (method: string, uri: string): Promise<string>
}

export const resolveInternalSourceUri = async (uri: string, invoke: Invoke = SharedProcess.invoke): Promise<string> => {
  if (internalSourcePrefixes.every((prefix) => !uri.startsWith(prefix))) {
    return uri
  }
  return invoke('GetElectronFileResponse.resolveElectronFileUri', uri)
}
