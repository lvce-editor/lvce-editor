import * as Pty from '../Pty/Pty.js'
import * as Debug from '../Debug/Debug.js'
import * as Assert from '../Assert/Assert.js'

export const state = {
  ptyMap: Object.create(null),
}

// TODO maybe merge pty and pty controller
export const create = (id, cwd, ipc) => {
  Assert.number(id)
  Assert.string(cwd)
  Assert.object(ipc)
  Debug.debug(`create ${id} ${cwd}`)
  const pty = Pty.create({ cwd })
  const handleData = (data) => {
    if (process.send) {
      process.send({
        jsonrpc: '2.0',
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
  if (!pty) {
    throw new Error(`pty ${id} not found`)
  }
  Pty.write(pty, data)
}

export const dispose = (id) => {
  const pty = state.ptyMap[id]
  if (!pty) {
    throw new Error(`pty ${id} not found`)
  }
  Pty.dispose(pty)
  delete state.ptyMap[id]
}

export const disposeAll = () => {
  for (const id in state.ptyMap) {
    dispose(id)
  }
}
