import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Workspace from '../Workspace/Workspace.js'

export const create = async (id, path) => {
  // TODO this should be invoke
  SharedProcess.send(
    /* createTerminal */ 'Terminal.create',
    /* id */ id,
    /* cwd */ Workspace.state.workspacePath
  )
}

export const write = async (id, input) => {
  await SharedProcess.invoke(
    /* Terminal.write */ 'Terminal.write',
    /* id */ id,
    /* input */ input
  )
}

export const resize = async (id, columns, rows) => {
  await SharedProcess.invoke(
    /* Terminal.resize */ 'Terminal.resize',
    /* id */ id,
    /* columns */ columns,
    /* rows */ rows
  )
}

export const clear = async () => {
  throw new Error('not implemented')
}
