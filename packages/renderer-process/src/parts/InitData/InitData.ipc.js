import * as Command from '../Command/Command.js'
import * as InitData from './InitData.js'

export const __initialize__ = () => {
  Command.register('InitData.getInitData', InitData.getInitData)
}
