import * as Pty from '../Pty/Pty.js'
import * as Debug from '../Debug/Debug.js'
import * as Assert from '../Assert/Assert.js'

export const state = {
  ptyMap: Object.create(null),
}

// TODO maybe merge pty and pty controller
export const create = (id, cwd, command, args, ipc) => {
  Assert.number(id)
  Assert.string(cwd)
  Assert.string(command)
  Assert.array(args)
  Assert.object(ipc)
  Debug.debug(`create ${id} ${cwd}`)
  const pty = Pty.create({ cwd, command, args })
  const handleData = (data) => {
    ipc.send({
      jsonrpc: '2.0',
      method: 'Viewlet.send',
      params: [id, 'handleData', data],
    })
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
  const { ptyMap } = state
  const pty = ptyMap[id]
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
