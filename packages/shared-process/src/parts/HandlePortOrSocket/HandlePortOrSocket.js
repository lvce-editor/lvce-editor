import * as Assert from '../Assert/Assert.js'
import * as EmbedsProcess from '../EmbedsProcess/EmbedsProcess.js'
import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as HandleSocketError from '../HandleSocketError/HandleSocketError.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.js'
import * as PtyHost from '../PtyHost/PtyHost.js'
import * as SearchProcess from '../SearchProcess/SearchProcess.js'

const mainProcessSpecialId = -5

const handlers = {
  // shared process
  1() {
    return {
      async targetWebSocket(message, handle) {
        handle.on('error', HandleSocketError.handleSocketError)
        const ipc = await IpcChild.listen({
          method: IpcChildType.WebSocket,
          request: message,
          handle,
        })
        return ipc
      },
      async upgradeWebSocket(message, handle) {
        return {
          type: 'handle',
        }
      },
      async targetMessagePort(messagePort, ...params) {
        Assert.object(messagePort)
        const ipc = await IpcChild.listen({
          method: IpcChildType.ElectronMessagePort,
          messagePort,
        })
        HandleIpc.handleIpc(ipc)
        if (params[0] === mainProcessSpecialId) {
          // update ipc with message port ipc that supports transferring objects
          // @ts-ignore
          ParentIpc.state.ipc = ipc
        }
        // TODO find better way to associate configuration with ipc
        // @ts-ignore
        ipc.windowId = params[1]
        return ipc
      },
      async upgradeMessagePort(messagePort, ...params) {
        return {
          type: 'handle',
        }
      },
    }
  },
  // pty host
  2() {
    return {
      targetWebSocket() {
        return PtyHost.getOrCreate()
      },
      upgradeWebSocket(message, handle) {
        return {
          type: 'send',
          method: 'HandleWebSocket.handleWebSocket',
          params: [message],
          transfer: handle,
        }
      },
      targetMessagePort() {
        return PtyHost.getOrCreate()
      },
      upgradeMessagePort(port) {
        return {
          type: 'send',
          method: 'HandleElectronMessagePort.handleElectronMessagePort',
          params: [],
          transfer: [port],
        }
      },
    }
  },
  // helper process
  3() {
    return {
      async targetWebSocket() {
        const ipc = await ExtensionHostHelperProcessIpc.create({
          method: IpcParentType.NodeForkedProcess,
        })
        return ipc
      },
      upgradeWebSocket(message, handle) {
        return {
          type: 'send',
          method: 'HandleWebSocket.handleWebSocket',
          params: [message],
          transfer: handle,
        }
      },
      async targetMessagePort() {
        const ipc = await ExtensionHostHelperProcessIpc.create({
          method: IpcParentType.ElectronUtilityProcess,
        })
        return ipc
      },
      upgradeMessagePort(port) {
        return {
          type: 'send',
          method: 'HandleElectronMessagePort.handleElectronMessagePort',
          params: [],
          transfer: [port],
        }
      },
    }
  },
  // embeds process
  4() {
    return {
      targetWebSocket() {
        return EmbedsProcess.getOrCreate()
      },
      upgradeWebSocket() {
        throw new Error('not implemented')
      },
      targetMessagePort() {
        return EmbedsProcess.getOrCreate()
      },
      upgradeMessagePort(port) {
        return {
          type: 'send',
          method: 'HandleElectronMessagePort.handleElectronMessagePort',
          params: [],
          transfer: [port],
        }
      },
    }
  },
  // process explorer
  7() {
    return {
      targetMessagePort() {
        return ProcessExplorer.getOrCreate()
      },
      upgradeMessagePort(port) {
        return {
          type: 'send',
          method: 'HandleElectronMessagePort.handleElectronMessagePort',
          params: [],
          transfer: [port],
        }
      },
    }
  },
  // search process
  8() {
    return {
      targetMessagePort() {
        return SearchProcess.getOrCreate()
      },
      upgradeMessagePort(port) {
        return {
          type: 'send',
          method: 'HandleElectronMessagePort.handleElectronMessagePort',
          params: [],
          transfer: [port],
        }
      },
    }
  },
}

export const handlePortOrSocket = (raw) => {}
