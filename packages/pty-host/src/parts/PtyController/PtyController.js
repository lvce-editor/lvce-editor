import * as Assert from '../Assert/Assert.js'
import * as Debug from '../Debug/Debug.js'
import * as Pty from '../Pty/Pty.js'
import * as PtyState from '../PtyState/PtyState.js'

// TODO maybe merge pty and pty controller
export const create = (ipc, id, cwd, command, args) => {
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
  PtyState.set(id, pty)
}

export const write = (id, data) => {
  const pty = PtyState.get(id)
  if (!pty) {
    throw new Error(`pty ${id} not found`)
  }
  Pty.write(pty, data)
}

export const resize = (id, columns, rows) => {
  const pty = PtyState.get(id)
  if (!pty) {
    throw new Error(`pty ${id} not found`)
  }
  Pty.resize(pty, columns, rows)
}

export const dispose = (id) => {
  const pty = PtyState.get(id)
  if (!pty) {
    throw new Error(`pty ${id} not found`)
  }
  Pty.dispose(pty)
  PtyState.remove(id)
}

export const disposeAll = () => {
  for (const id in PtyState.getAll()) {
    dispose(id)
  }
}
