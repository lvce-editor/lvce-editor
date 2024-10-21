import type { AboutState } from './ViewletAboutTypes.ts'
import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const renderDialog = {
  isEqual(oldState: AboutState, newState: AboutState) {
    return false
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderDialog]
