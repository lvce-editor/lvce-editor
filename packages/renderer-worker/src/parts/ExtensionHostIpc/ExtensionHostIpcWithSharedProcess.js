import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as Assert from '../Assert/Assert.js'

export const listen = async () => {
  await SharedProcess.invoke(/* ExtensionHost.start */ 'ExtensionHost.start')
}
