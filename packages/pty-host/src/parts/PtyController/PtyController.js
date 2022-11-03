import * as Pty from '../Pty/Pty.js'
import * as Debug from '../Debug/Debug.js'
import * as RpcOut from '../RpcOut/RpcOut.js'
import * as Assert from '../Assert/Assert.js'

export const state = {
  ptyMap: Object.create(null),
}

// TODO maybe merge pty and pty controller
export const create = (id, cwd) => {
  Assert.number(id)
  Assert.string(cwd)
  console.log('create terminal')
  Debug.debug(`create ${id} ${cwd}`)
  const pty = Pty.create({ cwd })
  const handleData = (data) => {
    RpcOut.send('Terminal.handleData', id, data)
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
