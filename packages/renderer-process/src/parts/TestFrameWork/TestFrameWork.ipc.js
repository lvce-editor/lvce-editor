import * as Command from '../Command/Command.js'
import * as TestFrameWork from './TestFrameWork.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('TestFrameWork.showOverlay', TestFrameWork.showOverlay)
  Command.register('TestFrameWork.performAction', TestFrameWork.performAction)
  Command.register('TestFrameWork.checkSingleElementCondition', TestFrameWork.checkSingleElementCondition)
  Command.register('TestFrameWork.checkMultiElementCondition', TestFrameWork.checkMultiElementCondition)
  Command.register('TestFrameWork.performKeyBoardAction', TestFrameWork.performKeyBoardAction)
}
