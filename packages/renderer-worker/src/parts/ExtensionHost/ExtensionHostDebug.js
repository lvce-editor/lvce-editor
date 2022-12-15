import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

export const listProcesses = async () => {
  const processes = await ExtensionHostShared.executeProvider({
    event: `onDebug`,
    method: 'ExtensionHostDebug.listProcesses',
    params: [],
    noProviderFoundMessage: 'no debug provider found',
  })
  Assert.array(processes)
  return processes
}
