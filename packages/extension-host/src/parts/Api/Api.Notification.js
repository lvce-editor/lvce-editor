import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import { ow } from './_shared.js'

export const show = (type, text) => {
  ow(type, ow.string.oneOf(['info', 'error']))
  ow(text, ow.string)
  SharedProcess.send({
    event: 'showNotification',
    args: [type, text],
  })
  // throw new Error('not implemented')
}

export const hide = (id) => {
  ow(id, ow.number)
  SharedProcess.send({
    event: 'hideNotification',
    args: [id],
  })
}
