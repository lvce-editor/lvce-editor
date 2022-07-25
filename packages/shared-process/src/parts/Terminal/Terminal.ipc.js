import * as Command from '../Command/Command.js'
import * as Assert from '../Assert/Assert.js'
import * as Terminal from './Terminal.js'

const create = (socket, id, cwd) => {
  Assert.object(socket)
  if (!socket) {
    console.log({socket, id, cwd})
    console.warn('socket not available')
    return
  }
  // terminalMap[id] = Terminal.create({
  //   handleData(data) {
  //     socket.send(
  //       JSON.stringify({
  //         jsonrpc: '2.0',
  //         method: 2133,
  //         params: ['Terminal', 'handleData', data],
  //       })
  //     )
  //   },
  //   cwd,
  // })
  Terminal.create(socket, id, cwd)
}

const write = (id, input) => {
  console.log({ id, input})
  Terminal.write(id, input)
}

const resize = (socket, id, columns, rows) => {
  Terminal.resize(id, columns, rows)
}

const dispose = (socket, id) => {
  Terminal.dispose(id)
}

export const __initialize__ = () => {
  Command.register('Terminal.create', create)
  Command.register('Terminal.dispose', dispose)
  Command.register('Terminal.write', write)
  Command.register('Terminal.resize', resize)
}
