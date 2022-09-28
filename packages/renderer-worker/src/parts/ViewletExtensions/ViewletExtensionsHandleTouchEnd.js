import * as Command from '../Command/Command.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import { setDeltaY } from './ViewletExtensions.js'
import * as Ease from '../Ease/Ease.js'

const easingFunction = Ease.linear

// const

export const handleTouchEnd = async (state, touches) => {
  if (touches.length === 0) {
    return state
  }
  const { touchOffsetY, touchDifference } = state
  const touch = touches[0]
  const newTouchOffsetY = touch.clientY
  const diff = newTouchOffsetY - touchOffsetY
  console.log({ touchDifference })
  let inertia = touchDifference
  let i = 0
  while (Math.abs(inertia) > 1.5) {
    console.log({ inertia })
    inertia /= 1.03
    await new Promise((r) => setTimeout(r, 10))
    const newState = ViewletStates.getState('Extensions')
    if (!newState) {
      break
    }
    const newDeltaY = newState.deltaY - inertia
    await Viewlet.setState('Extensions', setDeltaY(newState, newDeltaY))
  }
  return state
}
