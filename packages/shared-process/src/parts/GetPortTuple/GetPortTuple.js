import { VError } from '@lvce-editor/verror'
import * as TemporaryMessagePort from '../TemporaryMessagePort/TemporaryMessagePort.js'

// workaround for MessageChannelMain not being available in utility process
export const getPortTuple = async () => {
  try {
    const { port1, port2 } = await TemporaryMessagePort.getPortTuple()
    return { port1, port2 }
  } catch (error) {
    throw new VError(error, `Failed to get port tuple`)
  }
}
