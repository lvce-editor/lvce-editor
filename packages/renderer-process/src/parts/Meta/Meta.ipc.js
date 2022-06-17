import * as Command from '../Command/Command.js'
import * as Meta from './Meta.js'

export const __initialize__ = () => {
  Command.register(11122, Meta.setThemeColor)
}
