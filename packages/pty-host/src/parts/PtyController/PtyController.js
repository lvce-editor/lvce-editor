import * as Pty from '../Pty/Pty.js'
import * as Debug from '../Debug/Debug.js'

export const state = {
  ptyMap: Object.create(null),
}

const JSON_RPC_VERSION = '2.0'

// TODO maybe merge pty and pty controller
export const create = (id, cwd) => {
  Debug.debug(`create ${id} ${cwd}`)
  const pty = Pty.create({ cwd })
  const handleData = (data) => {
    if (process.send) {
      process.send({
        jsonrpc: JSON_RPC_VERSION,
        method: 'Terminal.handleData',
        params: [id, data],
      })
    }
  }
  Pty.onData(pty, handleData)
  state.ptyMap[id] = pty
}

export const write = (id, data) => {
  const pty = state.ptyMap[id]
  Pty.write(pty, data)
}

export const dispose = (id) => {
  const pty = state.ptyMap[id]
  Pty.dispose(pty)
  delete state.ptyMap[id]
}

export const disposeAll = () => {
  for (const id in state.ptyMap) {
    dispose(id)
  }
}
