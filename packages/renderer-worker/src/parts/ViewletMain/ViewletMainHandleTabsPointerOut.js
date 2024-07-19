import * as Assert from '../Assert/Assert.ts'

export const handleTabsPointerOut = (state, eventX, eventY) => {
  Assert.number(eventX)
  Assert.number(eventY)
  return {
    ...state,
  }
}
