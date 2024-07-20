import * as DeepCopy from '../DeepCopy/DeepCopy.ts'

export const getInitialLineState = (initialLineState: any) => {
  return DeepCopy.deepCopy(initialLineState)
}
