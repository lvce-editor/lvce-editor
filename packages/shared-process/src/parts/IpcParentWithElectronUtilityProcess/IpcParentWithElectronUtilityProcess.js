import * as CreateUtilityProcessRpc from '../CreateUtilityProcessRpc/CreateUtilityProcessRpc.js'
import * as FixElectronParameters from '../FixElectronParameters/FixElectronParameters.js'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as ParentIpc from '../MainProcess/MainProcess.js'
import * as TemporaryMessagePort from '../TemporaryMessagePort/TemporaryMessagePort.js'

export const create = async (options) => {
  // TODO how to launch process without race condition?
  // when promise resolves, process might have already exited
  if (!options.rpcId && !options.targetRpcId) {
    // TODO make targetRpcId required
    options.targetRpcId = Math.random()
  }
  await CreateUtilityProcessRpc.createUtilityProcessRpc(options)

  const { port1, port2 } = await GetPortTuple.getPortTuple()
  // TODO use uuid instead of name
  await TemporaryMessagePort.sendTo2(port2, options.targetRpcId, options.ipcId)
  port1.start()
  return port1
}

export const signal = (port) => {
  port.start()
}

const getActualData = (event) => {
  const { data, ports } = event
  if (ports.length > 0) {
    return {
      ...data,
      params: [...ports, ...data.params],
    }
  }
  return data
}

export const wrap = (port) => {
  return {
    port,
    wrappedListener: undefined,
    send(message) {
      this.port.postMessage(message)
    },
    async sendAndTransfer(message) {
      const { newValue, transfer } = FixElectronParameters.fixElectronParameters(message)
      this.port.postMessage(newValue, transfer)
    },
    on(event, listener) {
      switch (event) {
        case 'close':
          this.port.on(event, listener)
          break
        case 'message':
          // @ts-ignore
          this.wrappedListener = (event) => {
            const syntheticEvent = {
              data: getActualData(event),
              target: this,
            }
            listener(syntheticEvent)
          }
          this.port.on(event, this.wrappedListener)
          break
        default:
          break
      }
    },
    off(event, listener) {
      switch (event) {
        case 'close':
          this.port.off(event, listener)
          break
        case 'message':
          this.port.off(event, this.wrappedListener)
          this.wrappedListener = undefined
          break
        default:
          break
      }
    },
    dispose() {
      this.port.close()
      ParentIpc.invoke('TemporaryMessagePort.dispose', this.port.name)
    },
  }
}
