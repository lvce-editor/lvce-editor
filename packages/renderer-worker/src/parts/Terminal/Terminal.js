import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const create = async (id, cwd) => {
  await SharedProcess.invoke(/* Terminal.create */ 'Terminal.create', /* id */ id, /* cwd */ cwd)
}

export const write = async (id, input) => {
  await SharedProcess.invoke(/* Terminal.write */ 'Terminal.write', /* id */ id, /* input */ input)
}

export const resize = async (id, columns, rows) => {
  await SharedProcess.invoke(/* Terminal.resize */ 'Terminal.resize', /* id */ id, /* columns */ columns, /* rows */ rows)
}

export const clear = async (id) => {
  // TODO
}
