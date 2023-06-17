import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const open = async (id, file) => {
  await SharedProcess.invoke(/* OutputChannel.open */ 'OutputChannel.open', id, /* path */ file)
}

export const close = async (id) => {
  await SharedProcess.invoke(/* OutputChannel.close */ 'OutputChannel.close', /* id */ id)
}
