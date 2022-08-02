import { VALIDATION_ENABLED } from '../Flags/Flags.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import { ow } from '../Validation/Validation.js'

const JSON_RPC_VERSION = '2.0'

export const showNotification = (type, text) => {
  if (VALIDATION_ENABLED) {
    ow(type, ow.string.oneOf(['info', 'error']))
    ow(text, ow.string)
  }
  SharedProcess.send({
    jsonrpc: JSON_RPC_VERSION,
    method: /* Notification.create */ 'Notification.create',
    params: [type, text],
  })
  // throw new Error('not implemented')
}

export const showNotificationWithOptions = async (type, text, options) => {
  switch (type) {
    case 'error-dialog': {
      const selectedOption = await SharedProcess.invoke(
        /* Dialog.showMessage */ 'Dialog.showMessage',
        /* text */ text,
        /* options */ options
      )
      console.log('oky')
      break
    }
    case 'notificationDialog': {
      const selectedOption = await SharedProcess.invoke(
        /* Notification.showWithOptions */ 902,
        /* type */ type,
        /* text */ text,
        /* options */ options
      )
      break
    }
    case 'error': {
      console.log({ type, text, options })
      const selectedOption = await SharedProcess.invoke(
        /* Notification.showWithOptions */ 902,
        /* type */ type,
        /* text */ text,
        /* options */ options
      )
      break
    }
    default:
      break
  }
}

export const hide = (id) => {
  if (VALIDATION_ENABLED) {
    ow(id, ow.number)
  }
  SharedProcess.send({
    jsonrpc: JSON_RPC_VERSION,
    method: /* Notification.hide */ 901,
    params: [id],
  })
}
