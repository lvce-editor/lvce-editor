import * as IsNodeMessagePort from '../IsNodeMessagePort/IsNodeMessagePort.js'

export const isMessagePort = (value) => {
  return value && value.constructor && value.constructor.name === 'MessagePort' && !IsNodeMessagePort.isMessagePort(value)
}
