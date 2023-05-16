import * as Pty from '../Pty/Pty.js'
import * as Debug from '../Debug/Debug.js'
import * as Assert from '../Assert/Assert.js'

export const state = {
  ptyMap: Object.create(null),
}

const stack = []
let average = 0
let i = 0

const format = (time) => {
  return time.toFixed(3)
}

// TODO maybe merge pty and pty controller
export const create = (id, cwd, ipc) => {
  Assert.number(id)
  Assert.string(cwd)
  Assert.object(ipc)
  Debug.debug(`create ${id} ${cwd}`)

  const pty = Pty.create({ cwd })
  const handleData = (data) => {
    if (stack.length > 0) {
      i++
      const first = stack.pop()
      const end = performance.now()
      const diff = end - first
      average = ((i - 1) * average + diff) / i
      console.log(`took ${format(diff)}ms, average ${format(average)}ms, length ${stack.length}`)
      stack.length = 0
    }
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
  stack.push(performance.now())
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
