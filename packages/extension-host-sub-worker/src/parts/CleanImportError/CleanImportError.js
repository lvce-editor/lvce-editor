import * as GetModulesErrorStack from '../GetModulesErrorStack/GetModulesErrorStack.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

const cleanImportSyntaxError = (error) => {
  const cleanStackLines = GetModulesErrorStack.getModulesErrorStack(error.stack)
  const cleanError = new SyntaxError(error.message)
  const currentStack = JoinLines.joinLines(SplitLines.splitLines(new Error().stack).slice(3))
  const cleanStack = JoinLines.joinLines(cleanStackLines)
  const mergedStack = cleanStack + '\n' + currentStack
  cleanError.stack = mergedStack
  return cleanError
}

export const cleanImportError = (error) => {
  if (error && error instanceof SyntaxError) {
    return cleanImportSyntaxError(error)
  }
  return error
}
