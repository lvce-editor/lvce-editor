import * as Assert from '../Assert/Assert.js'
import * as HandleMessagePortForSharedProcess from '../HandleMessagePortForSharedProcess/HandleMessagePortForSharedProcess.js'

export const createMessagePort = async (type, name, port, browserWindowId) => {
  Assert.string(type)
  Assert.string(name)
  Assert.object(port)
  Assert.number(browserWindowId)
  await HandleMessagePortForSharedProcess.handlePort(port, browserWindowId)
}
