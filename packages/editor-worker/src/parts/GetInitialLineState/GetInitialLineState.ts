import * as DeepCopy from '../DeepCopy/DeepCopy.js'

export const getInitialLineState = (initialLineState: any) => {
  return DeepCopy.deepCopy(initialLineState)
}
