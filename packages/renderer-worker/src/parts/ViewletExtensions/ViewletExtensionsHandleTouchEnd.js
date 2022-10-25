import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Timeout from '../Timeout/Timeout.js'
import { setDeltaY } from './ViewletExtensionsSetDeltaY.js'

const applyInertia = async (touchDifference) => {
  let inertia = touchDifference
  let i = 0
  while (Math.abs(inertia) > 1.5) {
    inertia /= 1.03
    await Timeout.sleep(10)
    const newState = ViewletStates.getState('Extensions')
    if (!newState) {
      break
    }
    const newDeltaY = newState.deltaY - inertia
    await Viewlet.setState('Extensions', setDeltaY(newState, newDeltaY))
  }
}

export const handleTouchEnd = (state, touches) => {
  if (touches.length === 0) {
    return state
  }
  const { touchOffsetY, touchDifference } = state
  void applyInertia(touchDifference)
  // const touch = touches[0]
  // const newTouchOffsetY = touch.clientY
  // const diff = newTouchOffsetY - touchOffsetY
  // console.log({ touchDifference })
  // let inertia = touchDifference
  // let i = 0
  // while (Math.abs(inertia) > 1.5) {
  //   console.log({ inertia })
  //   inertia /= 1.03
  //   await new Promise((r) => setTimeout(r, 10))
  //   const newState = ViewletStates.getState('Extensions')
  //   if (!newState) {
  //     break
  //   }
  //   const newDeltaY = newState.deltaY - inertia
  //   await Viewlet.setState('Extensions', setDeltaY(newState, newDeltaY))
  // }
  // console.log('return state')
  return state
}
