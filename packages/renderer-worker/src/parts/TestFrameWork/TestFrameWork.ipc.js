import * as TestFrameWork from './TestFrameWork.js'

export const name = 'TestFrameWork'

export const Commands = {
  checkMultiElementCondition: TestFrameWork.checkMultiElementCondition,
  checkSingleElementCondition: TestFrameWork.checkSingleElementCondition,
  showOverlay: TestFrameWork.showOverlay,
  showTestResults: TestFrameWork.showTestResults,
  performAction: TestFrameWork.performAction,
  checkConditionError: TestFrameWork.checkConditionError,
}
