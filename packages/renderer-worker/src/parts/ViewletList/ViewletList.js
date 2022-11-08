import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const name = ViewletModuleId.List

export const create = () => {
  return {
    itemHeight: 20,
    finalDeltaY: 0,
    minLineY: 0,
    maxLineY: 0,
    deltaY: 0,
  }
}
