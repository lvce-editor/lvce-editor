import * as Command from '../Command/Command.js'
import * as TestFrameWork from './TestFrameWork.js'

export const __initialize__ = () => {
  Command.register('TestFrameWork.showOverlay', TestFrameWork.showOverlay)
}
