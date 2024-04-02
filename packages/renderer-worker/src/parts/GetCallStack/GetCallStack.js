import * as Assert from '../Assert/Assert.ts'

export const getCallStack = (callFrames) => {
  Assert.array(callFrames)
  const callStack = []
  for (const callFrame of callFrames) {
    callStack.push({
      functionName: callFrame.functionName || '(anonymous)',
      functionLocation: callFrame.functionLocation,
    })
  }
  return callStack
}
