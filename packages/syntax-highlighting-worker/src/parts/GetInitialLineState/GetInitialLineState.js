import * as DeepCopy from '../DeepCopy/DeepCopy.js'

export const getInitialLineState = (initialLineState) => {
  return DeepCopy.deepCopy(initialLineState)
}
